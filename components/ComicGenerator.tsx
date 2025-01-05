import { useState } from 'react';
import ComicStrip from './ComicStrip';

interface ComicGeneratorProps {
  story: string;
  setStory: (story: string) => void;
}

export default function ComicGenerator({ story, setStory }: ComicGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [comicPanels, setComicPanels] = useState<string[]>([]);
  const [panelDescriptions, setPanelDescriptions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const generateComic = async () => {
    if (!story.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setPanelDescriptions([]);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: story }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate comic');
      }

      const data = await response.json();
      setComicPanels(data.images);
      setPanelDescriptions(data.storyboard || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate comic. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Tell your story here... (e.g., 'In a dimly lit diner, a mysterious figure sips coffee while whispering secrets to their reflection in a warped mirror...')"
            className="w-full h-32 p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 border-2 border-cyan-500/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-200 font-pixel text-sm resize-none"
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
            {story.length}/500
          </div>
        </div>

        <button
          onClick={generateComic}
          disabled={isGenerating || !story.trim()}
          className={`w-full py-4 rounded-lg font-pixel text-lg transition-all duration-200 transform hover:scale-105 ${
            isGenerating || !story.trim()
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/20'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating Surreal Comic...</span>
            </div>
          ) : (
            'Transform Story into Comic'
          )}
        </button>

        {error && (
          <div className="text-red-500 text-center font-pixel text-sm p-3 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-lg bg-gray-800 p-8">
            <div className="flex justify-center items-center space-x-4">
              <div className="animate-pulse space-y-4">
                <div className="h-64 w-64 bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-48 bg-gray-700 rounded mx-auto"></div>
              </div>
              <div className="animate-pulse space-y-4">
                <div className="h-64 w-64 bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-48 bg-gray-700 rounded mx-auto"></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent"></div>
          </div>
        </div>
      )}

      {comicPanels.length > 0 && (
        <ComicStrip 
          panels={comicPanels} 
          descriptions={panelDescriptions}
        />
      )}
    </div>
  );
}
