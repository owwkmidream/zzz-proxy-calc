

export const ContribIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="0" // Default to fill based, but allow stroke override if needed
    >
        {/* Hexagon Background - slightly filled or outlined depending on preference. 
            The user styling applies color to the component. 
            I'll use currentColor for the main shapes to inherit the purple/teal colors.
        */}
        <defs>
            <linearGradient id="contribGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
            </linearGradient>
        </defs>

        {/* Outer Hexagon */}
        <path
            d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 Z"
            fill="currentColor"
            fillOpacity="0.15"
            transform="translate(0 -5)"
        />

        {/* Inner Hexagon Border */}
        <path
            d="M50 15 L85 35 V75 L50 95 L15 75 V35 Z"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />

        {/* Beet / Turnip Shape */}
        <g transform="translate(50, 60) scale(0.9)">
            {/* Leaves */}
            <path
                d="M-5 -25 Q-15 -45 -25 -35 Q-15 -35 -10 -20 M5 -25 Q15 -45 25 -35 Q15 -35 10 -20 M0 -25 Q0 -50 0 -40"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />
            {/* Root Body */}
            <path
                d="M0 0 C-20 0 -25 15 0 35 C25 15 20 0 0 0 Z"
                fill="currentColor"
                fillOpacity="0.9"
            />
        </g>
    </svg>
);

export const CreditIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="0"
    >
        <defs>
            <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
            </linearGradient>
        </defs>

        <g fill="url(#creditGradient)">
            {/* Top-Right Anchor Orb */}
            <circle cx="78" cy="25" r="7" />

            {/* Bottom-Left Anchor Orb */}
            <circle cx="28" cy="78" r="7" />

            {/* Main Upper Ribbon (Right to Left) */}
            <path
                d="M 78 25 
                   C 65 10 40 10 25 35 
                   C 15 50 20 70 28 78 
                   L 15 88 
                   L 35 90 
                   L 32 75 
                   C 25 65 25 45 40 30 
                   C 55 18 70 18 78 25 Z"
            />

            {/* Main Lower Ribbon (Left to Right) */}
            <path
                d="M 28 78
                   C 40 95 65 95 80 70
                   C 90 55 85 35 78 25
                   L 92 15
                   L 72 12
                   L 74 28
                   C 80 38 78 50 65 65
                   C 50 82 35 82 28 78 Z"
            />
        </g>
    </svg>
);
