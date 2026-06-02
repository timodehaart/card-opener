// app/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PackOpener from './components/PackOpener';
import { Card } from './components/CardReveal';
import { playSound } from './utils/sounds';

interface Pack {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

const PACKS: Pack[] = [
  {
    id: 'fire',
    name: 'Fire Pack',
    color: 'bg-gradient-to-br from-red-500 to-orange-600',
    description: 'Blazing hot cards',
    icon: '🔥',
  },
  {
    id: 'water',
    name: 'Water Pack',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-600',
    description: 'Cool aquatic cards',
    icon: '💧',
  },
  {
    id: 'grass',
    name: 'Grass Pack',
    color: 'bg-gradient-to-br from-green-400 to-emerald-600',
    description: 'Nature cards',
    icon: '🌿',
  },
  {
    id: 'electric',
    name: 'Electric Pack',
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    description: 'Charged cards',
    icon: '⚡',
  },
];

const CARD_NAMES = [
  'Charizard', 'Blastoise', 'Venusaur', 'Pikachu', 'Dragonite',
  'Gengar', 'Alakazam', 'Machamp', 'Golem', 'Arcanine',
  'Lapras', 'Snorlax', 'Articuno', 'Zapdos', 'Moltres',
];

export default function Home() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  const generateCards = (): Card[] => {
    const cardCount = Math.random() > 0.7 ? 6 : 5; // Occasionally 6 cards
    const cards: Card[] = [];

    for (let i = 0; i < cardCount; i++) {
      const rand = Math.random();
      let rarity: 'common' | 'uncommon' | 'rare' | 'holo' = 'common';
      
      if (rand > 0.9) {
        rarity = 'holo'; // 10% chance
      } else if (rand > 0.7) {
        rarity = 'rare'; // 20% chance
      } else if (rand > 0.4) {
        rarity = 'uncommon'; // 30% chance
      }

      cards.push({
        id: `${selectedPack?.id}-${i}`,
        name: CARD_NAMES[Math.floor(Math.random() * CARD_NAMES.length)],
        rarity,
        image: selectedPack?.icon || '🎴',
      });
    }

    return cards;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          Pack Opener
        </h1>
        <p className="text-gray-300 text-lg">Select a pack to reveal rare cards</p>
      </motion.div>

      {/* Packs Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {PACKS.map((pack) => (
          <motion.button
            key={pack.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedPack(pack);
              playSound('select');
            }}
            className={`relative h-56 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow ${pack.color}`}
          >
            {/* Pack content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-5xl mb-3 drop-shadow-lg"
              >
                {pack.icon}
              </motion.div>

              {/* Text */}
              <div className="relative z-10 text-center">
                <h3 className="text-white font-bold text-lg drop-shadow-md mb-1">
                  {pack.name}
                </h3>
                <p className="text-white/80 text-xs drop-shadow-md">
                  {pack.description}
                </p>
              </div>

              {/* Bottom shine effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-gray-400 text-sm"
      >
        <p>Click a pack to open it. Rare cards have special effects!</p>
      </motion.div>

      {/* Pack Opener Modal */}
      <AnimatePresence>
        {selectedPack && (
          <PackOpener
            key={selectedPack.id}
            packName={selectedPack.name}
            packColor={selectedPack.color}
            generateCards={generateCards}
            onClose={() => setSelectedPack(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}