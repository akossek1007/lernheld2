import * as React from 'react';
import { motion } from 'framer-motion';

export type RobotState = 'neutral' | 'jubelnd' | 'hilfsbereit';

interface RobotProps {
    state?: RobotState;
    className?: string;
}

export const Robot: React.FC<RobotProps> = ({ state = 'neutral', className }) => {
    return (
        <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-48 h-48 ${className}`}
        >
            {/* Body */}
            <rect
                x="50" y="70" width="100" height="80" rx="20"
                fill="var(--color-primary)"
            />

            {/* Head */}
            <motion.rect
                x="65" y="30" width="70" height="50" rx="15"
                fill="var(--color-primary)"
                animate={state === 'hilfsbereit' ? { rotate: -10 } : { rotate: 0 }}
            />

            {/* Eyes */}
            <motion.circle
                cx="85" cy="55" r="5" fill="white"
                animate={state === 'jubelnd' ? { scaleY: 0.2, scaleX: 1.5 } : { scaleY: 1 }}
            />
            <motion.circle
                cx="115" cy="55" r="5" fill="white"
                animate={state === 'jubelnd' ? { scaleY: 0.2, scaleX: 1.5 } : { scaleY: 1 }}
            />

            {/* Antenna */}
            <line x1="100" y1="10" x2="100" y2="30" stroke="var(--color-secondary)" strokeWidth="4" />
            <motion.circle
                cx="100" cy="10" r="5"
                fill="var(--color-secondary)"
                animate={state === 'jubelnd' ? { scale: [1, 1.5, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Arms */}
            <motion.rect
                x="30" y="90" width="15" height="40" rx="5"
                fill="var(--color-primary)"
                animate={state === 'jubelnd' ? { y: -20, rotate: -30 } : {}}
            />
            <motion.rect
                x="155" y="90" width="15" height="40" rx="5"
                fill="var(--color-primary)"
                animate={state === 'jubelnd' ? { y: -20, rotate: 30 } : state === 'hilfsbereit' ? { rotate: 45, x: 10 } : {}}
            />
        </svg>
    );
};
