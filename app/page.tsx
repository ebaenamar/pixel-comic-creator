'use client';

import { useState } from 'react';
import ComicGenerator from '@/components/ComicGenerator';

export default function Home() {
  const [story, setStory] = useState('');

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Pixel Art Dream Generator
          </h1>
          <p className="text-lg text-gray-300">
            Transform your ideas into surreal, Lynch-inspired pixel art scenes
          </p>
        </div>

        <ComicGenerator story={story} setStory={setStory} />
      </div>
    </main>
  );
}