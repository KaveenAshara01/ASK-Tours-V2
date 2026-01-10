export default function Logo({ className = "h-10", color = "currentColor" }) {
    // IBM-style striped pattern definition
    return (
        <svg
            viewBox="0 0 300 60"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="logoTitle"
        >
            <title id="logoTitle">ASK Tours Logo</title>
            <defs>
                <mask id="stripe-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {/* Create horizontal stripes by masking out lines */}
                    <rect y="8" width="140" height="3" fill="black" />
                    <rect y="16" width="140" height="3" fill="black" />
                    <rect y="24" width="140" height="3" fill="black" />
                    <rect y="32" width="140" height="3" fill="black" />
                    <rect y="40" width="140" height="3" fill="black" />
                    <rect y="48" width="140" height="3" fill="black" />
                </mask>
            </defs>

            {/* "ASK" with striped mask */}
            <text
                x="0"
                y="45"
                fontFamily="sans-serif"
                fontWeight="900"
                fontSize="50"
                fill={color}
                mask="url(#stripe-mask)"
                letterSpacing="2"
            >
                ASK
            </text>

            {/* "Tours" solid */}
            <text
                x="125"
                y="45"
                fontFamily="sans-serif"
                fontWeight="700"
                fontSize="50"
                fill={color}
                letterSpacing="1"
            >
                Tours
            </text>
        </svg>
    );
}
