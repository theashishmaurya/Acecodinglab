'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const frameworks = [
  { name: 'React', logo: '/assets/react-logo.svg' },
  { name: 'Vue', logo: '/assets/vue-logo.svg' },
  { name: 'Angular', logo: '/assets/angular-logo.svg' },
  { name: 'Svelte', logo: '/assets/svelte-logo.svg' },
];

const tips = [
  'Master the fundamentals of HTML, CSS, and JavaScript',
  'Build projects to showcase your skills',
  'Practice explaining your code and thought process',
  'Stay updated with the latest frontend trends',
  'Contribute to open-source projects',
  'Prepare for both technical and behavioral questions',
  'Learn to optimize for performance',
  'Understand responsive design principles',
];

export function LoadingScreen({
  message = 'Preparing your interview questions...',
}: {
  message?: string;
}) {
  const [currentFramework, setCurrentFramework] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const frameworkInterval = setInterval(() => {
      setCurrentFramework(prev => (prev + 1) % frameworks.length);
    }, 3000);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 5000);

    return () => {
      clearInterval(frameworkInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-12">
          Frontend Interview Prep
        </h1>

        <div className="relative w-32 h-32 mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.img
              key={frameworks[currentFramework].name}
              src={frameworks[currentFramework].logo}
              alt={`${frameworks[currentFramework].name} logo`}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="text-center text-white mb-12 h-16">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-lg"
            >
              {tips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center text-white">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span className="text-lg">{message}</span>
        </div>
      </motion.div>
    </div>
  );
}
