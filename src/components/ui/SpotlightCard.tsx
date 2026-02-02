'use client';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const darkGradient = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      hsla(var(--primary-foreground), 0.03),
      transparent 80%
    )
  `;
  const lightGradient = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      hsla(var(--primary), 0.03),
      transparent 80%
    )
  `;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative rounded-3xl border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-black/30',
        className
      )}
    >
        <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:hidden"
            style={{ background: lightGradient }}
        />
        <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden dark:block"
            style={{ background: darkGradient }}
        />
      {children}
    </div>
  );
}
