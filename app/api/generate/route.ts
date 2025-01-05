import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface PanelPrompt {
  description: string;
  prompt: string;
}

async function generateStoryboard(story: string): Promise<PanelPrompt[]> {
  // This would be replaced with actual ChatGPT API call
  const basePrompt = "A surreal and dreamlike scene in David Lynch's style. ";
  const panels: PanelPrompt[] = [
    {
      description: "Opening Scene - Setting the Mood",
      prompt: `${basePrompt} ${story} The scene is dimly lit with flickering neon lights casting unnatural shadows. The atmosphere is eerie and dreamlike, with a muted color palette of deep reds, blues, and shadowy blacks.`
    },
    {
      description: "Rising Tension - The Surreal Turn",
      prompt: `${basePrompt} The scene becomes more distorted and unsettling. Strange symbols emerge from the shadows, while characters move with an otherworldly quality.`
    },
    {
      description: "Climactic Moment - Reality Fractures",
      prompt: `${basePrompt} Multiple layers of existence overlap. The lighting becomes intense, creating stark contrasts. The scene pulses with electric energy.`
    },
    {
      description: "Resolution - The Dream Lingers",
      prompt: `${basePrompt} The scene resolves into a haunting image. Previous elements reappear transformed. The lighting creates a hypnotic quality.`
    }
  ];
  return panels;
}

async function waitForReplicateOutput(prediction: any): Promise<string> {
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds timeout
  
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
    const storyboard = await generateStoryboard(prompt);
    
    const imagePromises = storyboard.map(async (panel) => {
      const prediction = await replicate.predictions.create({
        version: "ad2ed84b27e27ce1e4a613c9b9c3b9c562bd8ca4b0271a35352ca158be1708b5",
        input: {
          prompt: panel.prompt,
          replicate_weights: "https://replicate.delivery/xezq/dDnQllIyR9pKBJo8MEHj5I76d6MA0eCDQrgoqcyiGHe9fTEoA/trained_model.tar"
        }
      });

      const imageUrl = await waitForReplicateOutput(prediction);
      return {
        url: imageUrl,
        description: panel.description
      };
    });

    const panels = await Promise.all(imagePromises);
    
    return NextResponse.json({ 
      panels,
      storyboard: storyboard.map(panel => panel.description)
    });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}
