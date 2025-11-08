import React from 'react';

interface NavButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                isActive ? 'bg-cyan-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};
