import React from 'react';

interface IconProps {
    size?: number;
    className?: string;
}

const createIcon = (path: React.ReactNode): React.FC<IconProps> => {
    return ({ size = 6, className = '' }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ width: `${size / 4}rem`, height: `${size / 4}rem` }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {path}
        </svg>
    );
};

export const SendIcon = createIcon(
    <path d="M22 2L11 13L2 9L22 2zM13 22L11 13" />
);

export const LoadingIcon: React.FC<IconProps> = ({ size = 6, className = '' }) => (
    <svg 
        className={`animate-spin ${className}`} 
        style={{ width: `${size / 4}rem`, height: `${size / 4}rem` }}
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SystemIcon = createIcon(
    <>
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="12" y2="16" />
    </>
);

export const UserIcon = createIcon(
    <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </>
);

export const AgentIcon = createIcon(
    <>
        <path d="M12 8V4H8" />
        <rect x="4" y="12" width="16" height="8" rx="2" />
        <path d="M12 12v-2a2 2 0 0 1 2-2h4v2" />
        <path d="M4 14.5L6.5 17 9 14.5" />
    </>
);

export const ErrorIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
);

export const ImageIcon = createIcon(
    <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </>
);

export const VizLabIcon = createIcon(
    <>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.88l-8.57 8.57A2 2 0 1 1 7 15" />
    </>
);

export const StoreIcon = createIcon(
    <>
        <path d="M18 6H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4Z" />
        <path d="M14 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </>
);

export const ContactsIcon = createIcon(
    <>
        <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <circle cx="12" cy="10" r="2" />
        <line x1="8" y1="2" x2="8" y2="4" />
        <line x1="16" y1="2" x2="16" y2="4" />
    </>
);

export const GamepadIcon = createIcon(
    <>
        <path d="M6 12h4m-2 2v-4" />
        <path d="m16.5 10.5-3-3-3 3" />
        <path d="M10 18a8 8 0 1 0-8-8 8 8 0 0 0 8 8Z" />
    </>
);

export const DojoIcon = createIcon(
    <>
        <path d="M4 20h16" />
        <path d="M4 10h16" />
        <path d="M10 4v16" />
        <path d="M14 4v16" />
        <path d="M4 4h2" />
        <path d="M4 8h2" />
        <path d="M4 12h2" />
        <path d="M4 16h2" />
        <path d="M18 4h2" />
        <path d="M18 8h2" />
        <path d="M18 12h2" />
        <path d="M18 16h2" />
    </>
);

export const PlaybookIcon = createIcon(
    <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
);

export const ArrowLeftIcon = createIcon(
    <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </>
);

export const CheckCircleIcon = createIcon(
    <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </>
);

export const InfoIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
);

export const XCircleIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </>
);

export const GradientIcon = createIcon(
    <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M2 12h20" />
);

export const AnimationIcon = createIcon(
    <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 5.5V11" />
        <path d="m15 8-3 3-3-3" />
    </>
);

export const TextStreamIcon = createIcon(
    <>
        <path d="M4 7V5h16v2" />
        <path d="M10 5v14" />
        <path d="M7 19h6" />
    </>
);

export const FadeIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12A10 10 0 0 0 12 2v10Z" />
    </>
);

export const PulseIcon = createIcon(
    <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </>
);

export const CharacterIcon = createIcon( // Same as UserIcon
    <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </>
);

export const StylerIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a7 7 0 1 0 10 10" />
    </>
);

export const TestTubeIcon = createIcon(
    <>
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h-1c-1.4 0-2.5-1.1-2.5-2.5V2" />
        <path d="M8.5 2h7" />
        <path d="M14.5 16h-5" />
    </>
);

export const GlitchIcon = createIcon(<path d="M10 3L6 8l4 5M14 21l4-5-4-5M18 8h-7M13 16H6" />);
export const HoloCardIcon = createIcon(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>);
export const MarketPulseIcon = createIcon(<polyline points="2 12 5 12 8 4 12 20 16 4 19 12 22 12" />);
export const GridIcon = createIcon(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></>);
export const NeonButtonIcon = createIcon(<><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M3 12h-2" /><path d="M21 12h2" /><path d="M12 7V5" /><path d="M12 17v2" /></>);
export const ScanlinesIcon = createIcon(<><path d="M2 6h20" /><path d="M2 9h20" /><path d="M2 12h20" /><path d="M2 15h20" /><path d="M2 18h20" /></>);
export const TerminalIcon = createIcon(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>);
export const LoaderBarIcon = createIcon(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4" /></>);
export const ParallaxIcon = createIcon(<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 16V4h12" /></>);
export const DataNodesIcon = createIcon(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>);
export const CampaignIcon = createIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></>);

// This is used as AgentAvatarIcon
export const AgentAvatarIcon = AgentIcon;