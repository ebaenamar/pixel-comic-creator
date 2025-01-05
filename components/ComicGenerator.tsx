'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
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
    <div className="space-y-6">
      <div className="relative">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Describe your story... (e.g., 'In a neon-lit cyberpunk city, a mysterious figure discovers an ancient pixel artifact...')"
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
        onClick={generateComic}
        disabled={isLoading || story.length < 10}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating Comic...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            <span>Transform into Comic</span>
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
        {panels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <ComicStrip panels={panels} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
