import * as React from 'react';

const BaseCard = ({ children }: { children: React.ReactNode }) => (
    <div className="w-40 h-40 bg-white rounded-3xl shadow-soft flex items-center justify-center border-2 border-neutral-soft">
        {children}
    </div>
);

const IconHouse = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <polygon points="60,15 10,55 20,55 20,105 100,105 100,55 110,55" fill="#f1c40f" stroke="#1f2a44" strokeWidth="4" />
        <rect x="45" y="70" width="30" height="35" fill="#ffffff" stroke="#1f2a44" strokeWidth="4" />
    </svg>
);

const IconPerson = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="60" cy="35" r="18" fill="#ffd6a5" stroke="#1f2a44" strokeWidth="4" />
        <rect x="35" y="58" width="50" height="45" rx="12" fill="#74b9ff" stroke="#1f2a44" strokeWidth="4" />
    </svg>
);

const IconFlower = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="60" cy="60" r="12" fill="#feca57" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="35" cy="55" r="12" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="85" cy="55" r="12" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="45" cy="80" r="12" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="75" cy="80" r="12" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <rect x="57" y="75" width="6" height="30" fill="#2ecc71" />
    </svg>
);

const IconWater = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <path d="M60 15 C45 40 30 55 30 75 a30 30 0 0 0 60 0 c0-20-15-35-30-60" fill="#74b9ff" stroke="#1f2a44" strokeWidth="4" />
    </svg>
);

const IconFire = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <path d="M60 15 C70 35 55 40 70 60 C80 75 75 95 60 105 C45 95 40 75 50 60 C60 45 50 35 60 15" fill="#ff9f43" stroke="#1f2a44" strokeWidth="4" />
    </svg>
);

const IconEarth = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="60" cy="60" r="35" fill="#74b9ff" stroke="#1f2a44" strokeWidth="4" />
        <path d="M45 40 C35 50 40 70 55 75 C70 80 80 60 75 45" fill="#2ecc71" />
    </svg>
);

const IconApple = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <circle cx="50" cy="65" r="22" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="75" cy="65" r="22" fill="#ff6b6b" stroke="#1f2a44" strokeWidth="4" />
        <rect x="58" y="25" width="6" height="18" fill="#1f2a44" />
        <ellipse cx="70" cy="25" rx="12" ry="6" fill="#2ecc71" />
    </svg>
);

const IconGrass = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <rect x="20" y="70" width="80" height="30" fill="#2ecc71" />
        <line x1="30" y1="70" x2="20" y2="50" stroke="#1f2a44" strokeWidth="4" />
        <line x1="50" y1="70" x2="45" y2="45" stroke="#1f2a44" strokeWidth="4" />
        <line x1="70" y1="70" x2="80" y2="48" stroke="#1f2a44" strokeWidth="4" />
    </svg>
);

const IconRoom = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <rect x="20" y="30" width="80" height="70" fill="#f5f6fa" stroke="#1f2a44" strokeWidth="4" />
        <rect x="30" y="60" width="25" height="20" fill="#74b9ff" stroke="#1f2a44" strokeWidth="3" />
        <rect x="65" y="55" width="20" height="35" fill="#ffd6a5" stroke="#1f2a44" strokeWidth="3" />
    </svg>
);

const IconGeneric = () => (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
        <rect x="25" y="25" width="70" height="70" rx="12" fill="#e0e6ed" stroke="#1f2a44" strokeWidth="4" />
        <circle cx="60" cy="60" r="12" fill="#b2bec3" />
    </svg>
);

const WordImageGraphic = ({ word }: { word: string }) => {
    const key = word.toUpperCase();
    switch (key) {
        case 'APFEL':
            return <IconApple />;
        case 'SCHULE':
        case 'HAUS':
        case 'SCHULLEHRER':
            return <IconHouse />;
        case 'LEHRER':
        case 'MUTTER':
        case 'VATER':
        case 'OMA':
        case 'OPA':
        case 'BRUDER':
        case 'SCHWESTER':
        case 'ONKEL':
        case 'TANTE':
            return <IconPerson />;
        case 'BLUME':
        case 'ROSE':
            return <IconFlower />;
        case 'WASSER':
            return <IconWater />;
        case 'FEUER':
            return <IconFire />;
        case 'ERDE':
            return <IconEarth />;
        case 'WIESE':
        case 'GARTEN':
            return <IconGrass />;
        case 'ZIMMER':
        case 'KUECHE':
        case 'KÜCHE':
            return <IconRoom />;
        default:
            return <IconGeneric />;
    }
};

export const WordImage = ({ word }: { word: string }) => {
    if (!word) return null;
    return (
        <BaseCard>
            <WordImageGraphic word={word} />
        </BaseCard>
    );
};

