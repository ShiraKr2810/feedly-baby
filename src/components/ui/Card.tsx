import { motion, type HTMLMotionProps } from 'framer-motion';

export function Card({ className = '', ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-3xl border border-line/80 bg-card p-5 shadow-soft backdrop-blur ${className}`}
      {...props}
    />
  );
}
