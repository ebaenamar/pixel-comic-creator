import { useState } from 'react';
import { motion } from 'framer-motion';

interface Scene {
  title: string;
  description: string;
  url: string;
}

export default function ComicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your story..."
          className="input-field h-32"
          required
          minLength={10}
        />
        <button
          type="submit"
          disabled={loading || prompt.length < 10}
          className="btn-primary w-full"
        >
          {loading ? 'Generating Comic...' : 'Generate Comic'}
        </button>
      </form>

      {error && (
        <div className="glass-panel p-4 text-red-400">
          {error}
        </div>
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