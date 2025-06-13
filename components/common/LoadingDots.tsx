'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

const DOT_STATES = ['.', '..', '...', '....'];

export default function LoadingDots() {
  const [dotIndex, setDotIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setDotIndex((prev) => (prev + 1) % DOT_STATES.length);
        setIsVisible(true);
      }, 150);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <motion.div
        className="relative flex items-center"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="text-sm font-medium text-gray-700">运行中</span>
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.span
              key={dotIndex}
              className="ml-1 text-sm font-bold text-gray-700"
              initial={{
                opacity: 0,
                scale: 0.8,
                x: -10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                x: 10,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              {DOT_STATES[dotIndex]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
