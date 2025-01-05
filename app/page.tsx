'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ComicGenerator from '@/components/ComicGenerator';

export default function Home() {
  const [story, setStory] = useState('');

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-4xl sm:text-5xl font-bold gradient-text"
          >
            Pixel Art Comic Creator
          </motion.h1>
          <p className="text-lg text-gray-300">
            Transform your stories into stunning pixel art comics
          </p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 sm:p-8"
        >
          <ComicGenerator story={story} setStory={setStory} />
        </motion.div>
      </motion.div>
    </main>
  );
}
