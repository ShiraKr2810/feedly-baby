import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'night';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-text shadow-lift hover:bg-primary-hover',
  secondary: 'border border-line bg-white/85 text-text-main shadow-sm hover:bg-white',
  ghost: 'bg-transparent text-text-muted hover:bg-blue-surface',
  danger: 'bg-pink-surface text-primary-text hover:bg-pink/55',
  night: 'bg-night-blue text-primary-text shadow-night hover:bg-primary',
};

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: Variant;
  icon?: ReactNode;
  children?: ReactNode;
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  icon,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
