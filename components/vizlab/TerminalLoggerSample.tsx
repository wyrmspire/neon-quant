import React, { useState, useEffect } from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

const logLines = [
    "INITIATING BOOT SEQUENCE...",
    "ACCESSING NEON QUANT CORE...",
    "SUCCESS: KERNEL LOADED.",
    "MOUNTING DATA STREAMS: [OK]",
    "LINKING GEMINI API... [CONNECTED]",
    "AGENT STATUS: [ONLINE]",
    "AWAITING USER COMMANDS..."
];

export const TerminalLoggerSample: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let lineIndex = 0;
        let charIndex = 0;

        const intervalId = setInterval(() => {
            if (lineIndex < logLines.length) {
                const currentLine = logLines[lineIndex];
                if (charIndex < currentLine.length) {
                    setLines(prev => {
                        const newLines = [...prev];
                        if (newLines.length <= lineIndex) {
                            newLines.push('');
                        }
                        newLines[lineIndex] = currentLine.substring(0, charIndex + 1);
                        return newLines;
                    });
                    charIndex++;
                } else {
                    lineIndex++;
                    charIndex = 0;
                }
            } else {
                // Optional: Loop or stop
                setTimeout(() => {
                    setLines([]);
                    lineIndex = 0;
                    charIndex = 0;
                }, 3000);
            }
        }, 50); // Typing speed

        return () => clearInterval(intervalId);
    }, []);

    return (
        <SamplePageLayout
            title="Terminal Logger"
            description="A component that simulates a terminal, displaying logs with a typewriter effect."
        >
            <div className="w-full max-w-2xl h-80 p-4 bg-black rounded-lg border-2 border-green-400/30 font-mono text-green-400 overflow-hidden">
                {lines.map((line, i) => (
                    <p key={i} className="whitespace-pre">
                        <span className="text-gray-500 mr-2">&gt;</span>{line}
                    </p>
                ))}
                <div className="inline-block w-2 h-5 bg-green-400 ml-2 animate-ping-caret"></div>
            </div>
             <style>{`
                @keyframes ping-caret {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-ping-caret { animation: ping-caret 1s step-end infinite; }
            `}</style>
        </SamplePageLayout>
    );
};