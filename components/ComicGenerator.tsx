'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface Scene {
  title: string;
  description: string;
  url: string;
}

const DEFAULT_STORY = "It's Serge's birthday";

export default function ComicGenerator() {
  const [prompt, setPrompt] = useState(DEFAULT_STORY);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFocus = () => {
    if (!hasInteracted) {
      setPrompt('');
      setHasInteracted(true);
    }
  };

  const generateComic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setScenes([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate comic');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setScenes(data.scenes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <form onSubmit={generateComic} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={handleFocus}
            placeholder="Describe your story... (e.g., 'In a neon-lit diner, a mysterious figure sips coffee while whispering secrets to their reflection...')"
            className="input-field h-32"
            required
            minLength={10}
            maxLength={500}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-400">
            {prompt.length}/500
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || prompt.length < 10}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Comic...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Pixel Art Comic</span>
            </>
          )}
        </motion.button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {scenes.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scenes.map((scene, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-panel p-4 space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  {scene.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {scene.description}
                </p>
                <div className="relative aspect-square">
                  <img
                    src={scene.url}
                    alt={scene.title}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}