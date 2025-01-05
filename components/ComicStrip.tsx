'use client';

import { motion } from 'framer-motion';

interface Panel {
  url: string;
  description: string;
}

interface ComicStripProps {
  panels: Panel[];
}

export default function ComicStrip({ panels }: ComicStripProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {panels.map((panel, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            className="glass-panel overflow-hidden group"
          >
            <div className="relative aspect-square">
              <img
                src={panel.url}
                alt={panel.description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
              >
                <p className="text-sm text-gray-200">
                  {panel.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
