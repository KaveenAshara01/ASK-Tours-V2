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
    const travelsX = isMobile ? 155 : 175;
    const taglineCenterX = isMobile ? 230 : 235;

    return (
        <svg
            viewBox="-5 -35 520 170"
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
                    {/* Luxury 'A' / Peak Symbol */}
                    <path d="M12 2L2 22H6.5L12 10L17.5 22H22L12 2Z" fill="#0ea5e9" />
                    <path d="M8 17H16V18.5H8V17Z" fill="#0ea5e9" />
                </symbol>
            </defs>

            {/* --- TEXT LAYER --- */}
            <g transform="translate(0, 10)">
                {/* "ASK" */}
                <text
                    x="15"
                    y="55"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="60"
                    fontStyle="italic"
                    fill={color}
                    stroke={color}
                    strokeWidth="2"
                    mask="url(#stripe-mask)"
                    letterSpacing="2"
                    transform={isMobile ? "skewX(-10)" : ""}
                >
                    ASK
                </text>

                {/* "TRAVELS" */}
                <text
                    x={travelsX}
                    y="55"
                    fontFamily="'Montserrat', sans-serif"
                    fontWeight="700"
                    fontSize="60"
                    fontStyle="italic"
                    fill={color}
                    letterSpacing="2"
                    style={{ textTransform: 'uppercase' }}
                >
                    Travels
                </text>

                {/* TAGLINE */}
                <text
                    x={taglineCenterX}
                    y="90"
                    fontFamily="'Montserrat', sans-serif"
                    fontWeight="600"
                    fontSize="22"
                    fill={color}
                    letterSpacing="6"
                    textAnchor="middle"
                    style={{ textTransform: 'uppercase', opacity: 0.9 }}
                >
                    Premier Travel Partner
                </text>
            </g>

        </svg>
    );
}
