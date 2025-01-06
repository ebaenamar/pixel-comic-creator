'use client';

import ComicGenerator from '@/components/ComicGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Pixel Art Comic Creator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Enter your story and watch as AI transforms it into a surreal, Lynch-inspired pixel art comic sequence.
          </p>
        </div>
        
        <ComicGenerator />
      </div>
    </main>
  );
}