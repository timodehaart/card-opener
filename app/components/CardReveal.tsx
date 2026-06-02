// app/components/CardReveal.tsx
'use client';

import { motion } from 'framer-motion';
import { playSound } from '@/utils/sounds';
import { useEffect } from 'react';

export interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'holo';
  image: string;
}

interface CardRevealProps {
  card: Card;
  onAnimationComplete?: () => void;
}

const rarityColors = {
  common: { bg: 'from-gray-400 to-gray-600', glow: 'var(--rarity-common)', shadow: 'shadow-gray-500/50' },
  uncommon: { bg: 'from-green-400 to-green-600', glow: 'var(--rarity-uncommon)', shadow: 'shadow-green-500/50' },
  rare: { bg: 'from-blue-400 to-blue-600', glow: 'var(--rarity-rare)', shadow: 'shadow-blue-500/50' },
  holo: { bg: 'from-purple-400 via-pink-400 to-purple-600', glow: 'var(--rarity-holo)', shadow: 'shadow-purple-500/50' },
};

export default function CardReveal({ card, onAnimationComplete }: CardRevealProps) {
  useEffect(() => {
    playSound('reveal');
  }, []);

  const colors = rarityColors[card.rarity];
  const isHolo = card.rarity === 'holo';

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ scale: 0, rotateY: -180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        className={`relative w-48 h-72 rounded-2xl bg-gradient-to-br ${colors.bg} p-1 shadow-2xl ${colors.shadow}`}
        animate={isHolo ? { rotateX: [0, 5, -5, 0], rotateY: [0, 5, -5, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Card inner content */}
        <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden flex flex-col items-center justify-between p-4">
          {/* Shimmer effect for holo cards */}
          {isHolo && (
            <div className="absolute inset-0 opacity-40 shimmer-effect pointer-events-none" />
          )}

          {/* Card image placeholder */}
          <div className="w-full h-40 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg flex items-center justify-center mb-2 overflow-hidden relative">
            <div className="text-white text-center">
              <div className="text-sm font-bold mb-2">{card.image}</div>
            </div>
            {isHolo && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            )}
          </div>

          {/* Card name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center"
          >
            <h3 className="text-white font-bold text-sm truncate max-w-full px-2">
              {card.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1 capitalize">
              {card.rarity}
            </p>
          </motion.div>

          {/* Rarity indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
              card.rarity === 'common' ? 'border-gray-400 bg-gray-400/20' :
              card.rarity === 'uncommon' ? 'border-green-400 bg-green-400/20' :
              card.rarity === 'rare' ? 'border-blue-400 bg-blue-400/20 animate-pulse' :
              'border-purple-400 bg-purple-400/20 glow-holo'
            }`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}