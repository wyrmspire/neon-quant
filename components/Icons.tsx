import React from 'react';

export const AgentIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

export const GamepadIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5a2 2 0 112.828-2.828L11 11.172l3.172-3.172a2 2 0 112.828 2.828l-5 5a2 2 0 01-2.828 0zM4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

export const SendIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const LoadingIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg className={`animate-spin h-${size} w-${size} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const SystemIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export const UserIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const ErrorIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ArrowLeftIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size} text-green-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size} text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const InfoIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size} text-cyan-400 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HubIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const StoreIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const ContactsIcon: React.FC<{ size?: number }> = ({ size = 6 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a3 3 0 00-3-3H9a3 3 0 00-3 3v1a6 6 0 006 6z" />
    </svg>
);

export const CharacterIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const ItemIcon: React.FC<{ size?: number }> = ({ size = 5 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size} w-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
);