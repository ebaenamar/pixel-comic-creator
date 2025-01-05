'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface GeneratedImage {
  url: string;
  prompt: string;
}

export default function ComicGenerator({ story, setStory }: { story: string; setStory: (story: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState('');

  const generateImage = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: story }),
      });

      if (!response.ok) throw new Error('Failed to generate image');
      
      const data = await response.json();
      setImage(data);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Describe your scene... (e.g., 'In a neon-lit diner, a mysterious figure sips coffee while whispering secrets to their reflection...')"
          className="input-field min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
          {story.length}/500
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateImage}
        disabled={isLoading || story.length < 10}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating Image...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            <span>Generate Pixel Art</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel overflow-hidden"
          >
            <div className="relative">
              <img
                src={image.url}
                alt="Generated pixel art"
                className="w-full h-auto object-cover rounded-t-lg"
                loading="lazy"
              />
              <div className="p-4 bg-black/50 text-sm text-gray-200">
                <p className="font-medium mb-2">Generated Scene:</p>
                <p>{image.prompt}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}