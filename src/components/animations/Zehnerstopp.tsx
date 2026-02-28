import { motion } from 'framer-motion';
import React from 'react';

export const Zehnerstopp = ({ start, middle, end }: { start: number, middle: number, end: number }) => {
    return (
        <div className="relative h-32 w-full bg-white rounded-xl shadow-inner flex items-end p-8 overflow-hidden">
            {/* Number Line */}
            <div className="absolute bottom-10 left-0 right-0 h-1 bg-neutral-soft" />

            {/* Jump 1 */}
            <motion.svg
                viewBox="0 0 100 50"
                className="absolute bottom-10 left-[10%] w-[40%] h-20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <path
                    d="M 0 50 Q 50 0 100 50"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                />
            </motion.svg>

            {/* Jump 2 */}
            <motion.svg
                viewBox="0 0 100 50"
                className="absolute bottom-10 left-[50%] w-[40%] h-20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <path
                    d="M 0 50 Q 50 0 100 50"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="2"
                />
            </motion.svg>

            <div className="absolute bottom-2 left-[10%] font-bold">{start}</div>
            <div className="absolute bottom-2 left-[50%] font-bold text-primary">{middle}</div>
            <div className="absolute bottom-2 left-[90%] font-bold text-secondary">{end}</div>
        </div>
    );
};
