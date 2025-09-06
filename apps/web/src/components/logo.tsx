export default function StaticLogo({ width = 100, height = 100 }) {
    return (
        <svg width={width} height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.7227 0.1920 149.5793)" strokeWidth="2" opacity="0.2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="oklch(0.7227 0.1920 149.5793)" strokeWidth="3" opacity="0.4" />
            <circle cx="50" cy="50" r="25" fill="oklch(0.7227 0.1920 149.5793)" />
            <path d="M30 50 Q40 35 50 50 T70 50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M25 50 L35 50 L40 35 L45 65 L50 50 L55 35 L60 65 L65 50 L75 50" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        </svg>
    )
}