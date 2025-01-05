import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import OpenAI from 'openai';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImagePrompt(story: string): Promise<string> {
  const prompt = `Create a vivid, detailed scene description for a surreal pixel art image based on this story: "${story}"
  Focus on creating a Lynch-inspired, dreamlike scene that would work well as pixel art.
  Include specific details about:
  - The main visual elements
  - The mood and atmosphere
  - The lighting and colors
  - Any surreal or symbolic elements
  
  Format the response as a single, detailed paragraph that can be used as an image generation prompt.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a surreal pixel artist specializing in David Lynch-inspired imagery. Create detailed, atmospheric scene descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to generate image description');
  }

  return `A pixel art scene in David Lynch's style: ${content}`;
}

async function waitForReplicateOutput(prediction: any): Promise<string> {
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    if (prediction.status === 'succeeded') {
      return prediction.output[0] || '';
    }
    if (prediction.status === 'failed') {
      throw new Error('Image generation failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await fetch(prediction.urls.get);
    prediction = await response.json();
    attempts++;
  }
  
  throw new Error('Timeout waiting for image generation');
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Generate the image description with GPT-4
    const imagePrompt = await generateImagePrompt(prompt);
    console.log('Generated prompt:', imagePrompt); // For debugging
    
    // Generate the image with Replicate
    const prediction = await replicate.predictions.create({
      version: "ad2ed84b27e27ce1e4a613c9b9c3b9c562bd8ca4b0271a35352ca158be1708b5",
      input: {
        prompt: imagePrompt,
        replicate_weights: "https://replicate.delivery/xezq/dDnQllIyR9pKBJo8MEHj5I76d6MA0eCDQrgoqcyiGHe9fTEoA/trained_model.tar"
      }
    });

    const imageUrl = await waitForReplicateOutput(prediction);
    
    return NextResponse.json({ 
      url: imageUrl,
      prompt: imagePrompt 
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
