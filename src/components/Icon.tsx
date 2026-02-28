import { LucideProps } from 'lucide-react';
import React from 'react';

/**
 * Global configuration for Lucide icons in LernHeld.
 * Ensures a consistent stroke-width of 2.5px for child-friendly legibility.
 */
export const Icon = ({ icon: IconComponent, ...props }: { icon: React.FC<LucideProps> } & LucideProps) => {
  return (
    <IconComponent 
      strokeWidth={2.5} 
      size={24} 
      {...props} 
    />
  );
};

// Example usage:
// <Icon icon={Home} className="text-primary" />
