// app/components/PackOpener.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { playSound } from '@/utils/sounds';
import CardReveal, { Card } from './CardReveal';

interface PackOpenerProps {
  packName: string;
  packColor: string;
  onClose: () => void;
  generateCards: () => Card[];
}

export default function PackOpener({ packName, packColor, onClose, generateCards }: PackOpenerProps) {
  const [stage, setStage] = useState<'ready' | 'opening' | 'revealing'>('ready');
  const [cards, setCards] = useState<Card[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const dragRef = useRef(0);

  const handleDragStart = () => {
    dragRef.current = 0;
  };

  const handleDrag = (_: any, info: any) => {
    const progress = Math.max(0, Math.min(1, -info.offset.y / 150));
    setSwipeProgress(progress);

    if (progress > 0.7 && stage === 'ready') {
      completeSwipe();
    }
  };

  const completeSwipe = () => {
    if (stage === 'ready') {
      setStage('opening');
      playSound('open');
      const newCards = generateCards();
      setCards(newCards);
      setTimeout(() => {
        setStage('revealing');
        setRevealIndex(0);
      }, 800);
    }
  };

  const handleNextCard = () => {
    if (revealIndex < cards.length - 1) {
      setRevealIndex(revealIndex + 1);
    } else {
      playSound('success');
      setTimeout(onClose, 500);
    }
  };

  if (stage === 'revealing' && cards.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={handleNextCard}
      >
        <motion.div
          className="flex flex-col items-center gap-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <CardReveal card={cards[revealIndex]} />
          
          <div className="text-center">
            <p className="text-white text-sm mb-2">
              Card {revealIndex + 1} of {cards.length}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextCard}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {revealIndex === cards.length - 1 ? 'Done' : 'Next Card'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 flex items-center justify-center z-50"
    >
      <div className="w-full max-w-sm px-4">
        {/* Swipe indicator */}
        {stage === 'ready' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-center"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <p className="text-white text-sm font-medium">Swipe up to open</p>
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* Pack */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -150, bottom: 0 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={completeSwipe}
          animate={{
            y: swipeProgress * -150,
            rotateZ: stage === 'opening' ? 360 : swipeProgress * 10,
          }}
          transition={
            stage === 'opening'
              ? { duration: 0.8, type: 'spring' }
              : { type: 'spring', stiffness: 300, damping: 30 }
          }
          className="cursor-grab active:cursor-grabbing"
        >
          <motion.div
            className={`relative w-48 h-64 mx-auto rounded-3xl shadow-2xl overflow-hidden transform-gpu ${packColor}`}
            animate={
              stage === 'opening'
                ? {
                    scaleY: [1, 1.2, 0.3],
                    rotateX: [0, 360],
                    opacity: [1, 0.7, 0],
                  }
                : {}
            }
            transition={stage === 'opening' ? { duration: 0.8 } : { type: 'spring' }}
          >
            {/* Pack exterior */}
            <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20 flex flex-col items-center justify-center p-6">
              {/* Pack label */}
              <motion.div
                animate={
                  stage === 'opening'
                    ? { opacity: 0, scale: 0.5 }
                    : {}
                }
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <h2 className="text-white text-2xl font-bold drop-shadow-lg mb-2">
                  {packName}
                </h2>
                <p className="text-white/70 text-sm drop-shadow">
                  Pack Opening
                </p>
              </motion.div>

              {/* Swipe line */}
              {stage === 'ready' && (
                <motion.div
                  animate={{
                    scaleX: [0.3, 1, 0.3],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-12 w-16 h-1 bg-white/50 rounded-full"
                />
              )}

              {/* Opening flash */}
              {stage === 'opening' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-white/20 blur-md"
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}