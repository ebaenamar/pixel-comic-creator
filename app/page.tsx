'use client';

import { useState } from 'react';
import ComicGenerator from '../components/ComicGenerator';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const [story, setStory] = useState('');

  return (
    <main className="min-h-screen relative">
      {/* Background with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-gray-800" />
      
      {/* Animated pixel noise overlay */}
      <div className="fixed inset-0 pixel-noise" />
      
      {/* Animated vignette effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black opacity-50" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Header />
          
          {/* Decorative pixel art elements */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-20 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-transparent animate-pulse" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full bg-gradient-to-bl from-red-500 to-transparent animate-pulse delay-100" />
          </div>

          <ComicGenerator story={story} setStory={setStory} />
          
          {/* Lynch-inspired decorative elements */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-50" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-red-500 animate-pulse" />
            <div className="w-2 h-2 bg-blue-500 animate-pulse delay-75" />
            <div className="w-2 h-2 bg-purple-500 animate-pulse delay-150" />
          </div>

          <Footer />
        </div>
      </div>
    </main>
  );
}
