'use client';

import { useState } from 'react';
import ComicGenerator from '@/components/ComicGenerator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [story, setStory] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <div className="max-w-4xl mx-auto py-8">
        <Header />
        <ComicGenerator story={story} setStory={setStory} />
        <Footer />
      </div>
    </main>
  );
}
