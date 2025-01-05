import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface StoryboardPanel {
  description: string;
  prompt: string;
}

function createLynchianStoryboard(story: string): StoryboardPanel[] {
  // This function creates a Lynch-inspired interpretation of the story
  const basePrompt = "A surreal and dreamlike scene in David Lynch's style. ";
  const panels: StoryboardPanel[] = [];

  // Panel 1: Introduction/Setting
  panels.push({
    description: "Establishing the surreal setting",
    prompt: `${basePrompt} ${story}. The scene is dimly lit with flickering neon lights casting unnatural shadows. The atmosphere is eerie and dreamlike, with a muted color palette of deep reds, blues, and shadowy blacks. A sense of unease permeates the scene.`
  });

  // Panel 2: Rising Action
  panels.push({
    description: "Building tension",
    prompt: `${basePrompt} The scene becomes more distorted and unsettling. Strange symbols and patterns emerge from the shadows. The characters move through the space with an otherworldly quality, their expressions reflecting a mix of confusion and revelation.`
  });

  // Panel 3: Climax
  panels.push({
    description: "Surreal climax",
    prompt: `${basePrompt} The reality begins to fracture. Multiple layers of existence seem to overlap. The lighting becomes more intense, creating stark contrasts. The scene pulses with an electric energy, as if the very fabric of reality is being questioned.`
  });

  // Panel 4: Resolution/Twist
  panels.push({
    description: "Enigmatic conclusion",
    prompt: `${basePrompt} The scene resolves into a haunting final image. Elements from earlier panels reappear in transformed ways. The lighting creates a hypnotic quality, suggesting that what we've witnessed might be both real and unreal simultaneously.`
  });

  return panels;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const storyboard = createLynchianStoryboard(prompt);
    
    const imagePromises = storyboard.map(async (panel) => {
      const output = await replicate.predictions.create({
        version: "sundai-club/lynch",
        input: {
          prompt: panel.prompt,
        }
      });
      return output;
    });

    const images = await Promise.all(imagePromises);
    return NextResponse.json({ 
      images,
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
