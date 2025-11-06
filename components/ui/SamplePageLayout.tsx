import React from 'react';

export const SamplePageLayout: React.FC<{ title: string; description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="p-8 h-full flex flex-col">
        <header className="text-center mb-8 flex-shrink-0">
            <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-lg text-gray-400 mt-1">{description}</p>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-6">
            {children}
        </main>
    </div>
);
