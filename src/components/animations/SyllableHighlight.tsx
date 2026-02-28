import { motion } from 'framer-motion';
import React from 'react';

export const SyllableHighlight = ({ word, syllables }: { word: string, syllables: string[] }) => {
    return (
        <div className="flex gap-2 text-6xl font-display font-bold">
            {syllables.map((syllable, index) => (
                <motion.span
                    key={index}
                    initial={{ color: 'var(--color-primary)' }}
                    animate={{
                        color: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-primary)'],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: index * 0.5,
                        delay: index * 0.5
                    }}
                    className="px-2 border-b-4 border-neutral-soft"
                >
                    {syllable}
                </motion.span>
            ))}
        </div>
    );
};
