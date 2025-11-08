import React from 'react';

interface AppLayoutProps {
    header: React.ReactNode;
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ header, children }) => {
    return (
        <div className="bg-transparent text-white min-h-screen flex flex-col font-sans">
            {header}
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
};
