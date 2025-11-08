import React, { useState } from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

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