import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import OpenAI from 'openai';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface StoryPanel {
  title: string;
  description: string;
  mood: string;
  visualElements: string[];
}

interface PanelPrompt {
  description: string;
  prompt: string;
}

async function generateStoryboardWithGPT(story: string): Promise<StoryPanel[]> {
  const prompt = `Create a 4-panel storyboard for a surreal, Lynch-inspired comic based on this story: "${story}"
  
  Format each panel as JSON with:
  - title: A short title for the panel
  - description: A vivid description of what happens in this panel
  - mood: The emotional atmosphere and lighting
  - visualElements: Key visual elements to include (3-4 items)

  Make it mysterious and engaging, with a clear narrative arc across the 4 panels.
  Focus on creating surreal, dreamlike imagery that would work well in pixel art style.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a comic book artist specializing in surreal, David Lynch-inspired storytelling. You excel at breaking down stories into vivid visual sequences."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to generate storyboard');
  }

  const response = JSON.parse(content);
  if (!response.panels || !Array.isArray(response.panels)) {
    throw new Error('Invalid storyboard format');
  }

  return response.panels;
}

function createImagePrompt(panel: StoryPanel): string {
  const visualElements = panel.visualElements.join(", ");
  return `A surreal and dreamlike pixel art scene in David Lynch's style. ${panel.description}
         The mood is ${panel.mood}. Key elements: ${visualElements}.
         The scene should be highly detailed pixel art with a resolution that captures intricate details.
         Use a color palette inspired by Lynch's films with deep reds, blues, and shadowy blacks.`.replace(/\s+/g, ' ').trim();
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
    
    // First, generate the storyboard with GPT-4
    const storyPanels = await generateStoryboardWithGPT(prompt);
    
    // Then, create image prompts and generate images
    const imagePromises = storyPanels.map(async (panel) => {
      const imagePrompt = createImagePrompt(panel);
      const prediction = await replicate.predictions.create({
        version: "ad2ed84b27e27ce1e4a613c9b9c3b9c562bd8ca4b0271a35352ca158be1708b5",
        input: {
          prompt: imagePrompt,
          replicate_weights: "https://replicate.delivery/xezq/dDnQllIyR9pKBJo8MEHj5I76d6MA0eCDQrgoqcyiGHe9fTEoA/trained_model.tar"
        }
      });

      const imageUrl = await waitForReplicateOutput(prediction);
      return {
        url: imageUrl,
        description: `${panel.title}: ${panel.description}`
      };
    });

    const panels = await Promise.all(imagePromises);
    
    return NextResponse.json({ panels });
  } catch (error) {
    console.error('Error generating comic:', error);
    return NextResponse.json(
      { error: 'Failed to generate comic' },
      { status: 500 }
    );
  }
}
