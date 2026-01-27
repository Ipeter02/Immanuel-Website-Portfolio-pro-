import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Define a flexible type that works for both button and anchor usages with Motion
type ButtonProps = {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement> & HTMLMotionProps<"button"> & HTMLMotionProps<"a">;

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  href,
  external,
  ...props 
}) => {
  // Changed transition-all to transition-colors to allow Framer Motion to handle transforms exclusively without CSS conflicts
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 border border-transparent active:shadow-none active:opacity-85",
    outline: "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-cream dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-primary/50 dark:hover:border-primary/50 active:bg-slate-100 dark:active:bg-slate-800 active:border-slate-400 dark:active:border-slate-600",
    ghost: "hover:bg-cream dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:bg-slate-200 dark:active:bg-slate-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 py-2 px-5",
    lg: "h-14 px-8 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a 
        href={href} 
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={classes} {...props}>
      {children}
    </motion.button>
  );
};

export default Button;