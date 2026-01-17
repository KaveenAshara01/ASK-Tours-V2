import { useState, useEffect } from 'react';

export default function Logo({ className = "h-16", color = "currentColor" }) { // Increased default height
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check initially
        checkMobile();

        // Listen for resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Responsive Coordinates
    const travelsX = isMobile ? 140 : 155; // Closer on mobile (140), Wider on desktop (155)
    const starX = isMobile ? 410 : 425;    // Moving star to match

    return (
        <svg
            viewBox="-40 -40 500 130"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="logoTitle"
        >
            <title id="logoTitle">ASK Travels Logo</title>
            <defs>
                <mask id="stripe-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <rect y="8" width="200" height="3" fill="black" />
                    <rect y="16" width="200" height="3" fill="black" />
                    <rect y="24" width="200" height="3" fill="black" />
                    <rect y="32" width="200" height="3" fill="black" />
                    <rect y="40" width="200" height="3" fill="black" />
                    <rect y="48" width="200" height="3" fill="black" />
                </mask>
                {/* 8-Point Compass Rose Star */}
                <symbol id="star" viewBox="0 0 24 24">
                    <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill={color} />
                </symbol>
            </defs>

            {/* --- TEXT LAYER --- */}
            <g transform="translate(0, 10)">
                {/* "ASK" */}
                <text
                    x="20"
                    y="45"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="50"
                    fontStyle="italic"
                    fill={color}
                    mask="url(#stripe-mask)"
                    letterSpacing="2"
                >
                    ASK
                </text>

                {/* "TRAVELS" */}
                <text
                    x={travelsX}
                    y="45"
                    fontFamily="'Montserrat', sans-serif"
                    fontWeight="700"
                    fontSize="50"
                    fontStyle="italic"
                    fill={color}
                    letterSpacing="2"
                    style={{ textTransform: 'uppercase' }}
                >
                    Travels
                </text>

                {/* SINGLE STAR - Trademark Style (Above 'S') */}
                <use href="#star" x="0" y="0" width="20" height="20" transform={`translate(${starX}, 5)`} />

                {/* TAGLINE */}
                <text
                    x="225"
                    y="75"
                    fontFamily="'Montserrat', sans-serif"
                    fontWeight="500"
                    fontSize="18"
                    fill={color}
                    letterSpacing="6"
                    textAnchor="middle"
                    style={{ textTransform: 'uppercase', opacity: 0.8 }}
                >
                    Premier Travel Partner
                </text>
            </g>

        </svg>
    );
}
