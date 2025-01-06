import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import OpenAI from 'openai';

export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface ScenePrompt {
  scene: string;
  description: string;
}

async function generateImagePrompts(story: string): Promise<ScenePrompt[]> {
  try {
    const prompt = `Create two connected scenes for a surreal pixel art comic based on this story: "${story}"
    Focus on creating Lynch-inspired, dreamlike scenes that work well as pixel art and flow together narratively.
    
    For each scene, include:
    - The main visual elements and action
    - The mood and atmosphere
    - The lighting and colors
    - Any surreal or symbolic elements
    
    Format your response as a JSON array with exactly 2 objects, each containing:
    - scene: A short title for the scene
    - description: A detailed paragraph describing the scene for image generation
    
    Example format:
    [
      {
        "scene": "The Mysterious Phone Call",
        "description": "In a dimly lit room, a figure answers an old rotary phone..."
      },
      {
        "scene": "The Dream Sequence",
        "description": "The scene transitions to a surreal dreamscape..."
      }
    ]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a surreal pixel artist specializing in David Lynch-inspired imagery. Create detailed, atmospheric scene descriptions that connect narratively."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to generate scene descriptions');
    }

    const scenes = JSON.parse(content).scenes || [];
    if (!Array.isArray(scenes) || scenes.length !== 2) {
      throw new Error('Invalid scene format returned');
    }

    return scenes.map(scene => ({
      scene: scene.scene,
      description: `A pixel art scene in David Lynch's style: ${scene.description}`
    }));
  } catch (error) {
    console.error('Error generating prompts:', error);
    throw new Error('Failed to generate scene descriptions');
  }
}

async function generateImage(prompt: string): Promise<string> {
  try {
    const prediction = await replicate.predictions.create({
      version: "ad2ed84b27e27ce1e4a613c9b9c3b9c562bd8ca4b0271a35352ca158be1708b5",
      input: {
        prompt: prompt,
        width: 512,
        height: 512,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        negative_prompt: "blurry, low quality, low resolution, ugly, distorted",
        replicate_weights: "https://replicate.delivery/xezq/dDnQllIyR9pKBJo8MEHj5I76d6MA0eCDQrgoqcyiGHe9fTEoA/trained_model.tar"
      }
    });

    const streamUrl = prediction.urls?.stream;
    if (streamUrl) {
      return streamUrl;
    }

    const predictionUrl = prediction.urls?.get;
    if (!predictionUrl) {
      throw new Error('Failed to get prediction URL');
    }

    let attempts = 0;
    const maxAttempts = 180;
    
    while (attempts < maxAttempts) {
      const response = await fetch(predictionUrl);
      const result = await response.json();

      if (result.status === 'succeeded') {
        return result.output[0] || '';
      }
      if (result.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    throw new Error('Timeout waiting for image generation');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Missing API keys' },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }
    
    // Generate two scene descriptions
    const scenes = await generateImagePrompts(prompt);
    
    // Generate both images in parallel
    const [image1, image2] = await Promise.all([
      generateImage(scenes[0].description),
      generateImage(scenes[1].description)
    ]);
    
    return NextResponse.json({ 
      scenes: [
        {
          title: scenes[0].scene,
          description: scenes[0].description,
          url: image1
        },
        {
          title: scenes[1].scene,
          description: scenes[1].description,
          url: image2
        }
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate comic' },
      { status: 500 }
    );
  }
}