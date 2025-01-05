import { useState } from 'react';
import ComicStrip from './ComicStrip';

interface ComicGeneratorProps {
  story: string;
  setStory: (story: string) => void;
}

export default function ComicGenerator({ story, setStory }: ComicGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [comicPanels, setComicPanels] = useState<string[]>([]);

  const generateComic = async () => {
    if (!story.trim()) return;
    
    setIsGenerating(true);
    try {
      // TODO: Integrate with AI API to generate panels
      // For now, we'll use placeholder panels
      const panels = Array(4).fill('/placeholder-panel.png');
      setComicPanels(panels);
    } catch (error) {
      console.error('Failed to generate comic:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Enter your story here..."
          className="w-full h-32 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />
        <button
          onClick={generateComic}
          disabled={isGenerating || !story.trim()}
          className={`w-full py-3 rounded-lg font-pixel ${
            isGenerating || !story.trim()
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600'
          }`}
        >
          {isGenerating ? 'Generating Comic...' : 'Create Comic'}
        </button>
      </div>

      {comicPanels.length > 0 && <ComicStrip panels={comicPanels} />}
    </div>
  );
}
