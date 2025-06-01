import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </motion.div>
  );
};
