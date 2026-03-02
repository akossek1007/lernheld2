import { motion } from 'framer-motion';
import React from 'react';

export const Zehnerstopp = ({ start, middle, end }: { start: number, middle: number, end: number }) => {
    const totalDiff = end - start || 1;
    const jump1Ratio = (middle - start) / totalDiff;
    const jump2Ratio = (end - middle) / totalDiff;

    // Total available width is 80% (from 10% to 90%)
    const width1 = jump1Ratio * 80;
    const width2 = jump2Ratio * 80;
    const posMiddle = 10 + width1;

    return (
        <div className="relative h-32 w-full bg-white rounded-xl shadow-inner flex items-end p-8 overflow-hidden">
            {/* Number Line */}
            <div className="absolute bottom-10 left-0 right-0 h-1 bg-neutral-soft" />

            {/* Jump 1 */}
            <motion.svg
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                style={{ left: `10%`, width: `${width1}%` }}
                className="absolute bottom-10 h-20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <path
                    d="M 0 50 Q 50 0 100 50"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.svg>

            {/* Jump 2 */}
            <motion.svg
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
                style={{ left: `${posMiddle}%`, width: `${width2}%` }}
                className="absolute bottom-10 h-20"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <path
                    d="M 0 50 Q 50 0 100 50"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                />
            </motion.svg>

            <div className="absolute bottom-2 font-bold transform -translate-x-1/2" style={{ left: '10%' }}>{start}</div>
            <div className="absolute bottom-2 font-bold text-primary transform -translate-x-1/2" style={{ left: `${posMiddle}%` }}>{middle}</div>
            <div className="absolute bottom-2 font-bold text-secondary transform -translate-x-1/2" style={{ left: '90%' }}>{end}</div>
        </div>
    );
};
