'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const directionOffsets = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: -24 },
    right: { x: 24 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          ...directionOffsets[direction],
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
        },
      }}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 100,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
