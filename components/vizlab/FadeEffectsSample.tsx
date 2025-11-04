import React, { useState } from 'react';

const SamplePageLayout: React.FC<{ title: string; description: string, children: React.ReactNode }> = ({ title, description, children }) => (
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

export const FadeEffectsSample: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <SamplePageLayout
            title="Fade Effects"
            description="Interactive demonstration of fading elements in and out."
        >
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="px-6 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors"
            >
                Toggle Visibility
            </button>
            <div className="w-full max-w-md h-48 p-8 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-center">
                <div 
                    className={`p-6 bg-purple-600 rounded-lg text-white font-bold text-xl transition-opacity duration-500 ease-in-out ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    Fade Me!
                </div>
            </div>
        </SamplePageLayout>
    );
};
