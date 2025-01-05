import { useState } from 'react';
import ComicStrip from './ComicStrip';

interface Panel {
  url: string;
  description: string;
}

export default function ComicGenerator({ story, setStory }: { story: string; setStory: (story: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [error, setError] = useState('');

  const generateComic = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: story }),
      });

      if (!response.ok) throw new Error('Failed to generate comic');
      
      const data = await response.json();
      setPanels(data.panels);
    } catch (err) {
      setError('Failed to generate comic. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4">
      <div className="relative">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Enter your story idea..."
          className="w-full h-24 p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg 
                     text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 
                     focus:border-transparent resize-none"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {story.length}/500
        </div>
      </div>

      <button
        onClick={generateComic}
        disabled={isLoading || story.length < 10}
        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
                   ${isLoading || story.length < 10 
                     ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                     : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
                   }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          'Transform into Comic'
        )}
      </button>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {panels.length > 0 && (
        <ComicStrip panels={panels} />
      )}
    </div>
  );
}
