import React, { useState, useEffect } from 'react';
import { Session, CoachFeedback, Episode } from '../types';
import { geminiService } from '../services/geminiService';
import { mockApi } from '../services/mockApi';
import { CheckCircleIcon, XCircleIcon, InfoIcon, LoadingIcon, VizLabIcon } from './Icons';

interface DebriefScreenProps {
    session: Session;
    episode: Episode;
    onAcknowledge: () => void;
}

export const DebriefScreen: React.FC<DebriefScreenProps> = ({ session, episode, onAcknowledge }) => {
    const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateFeedback = async () => {
            setIsLoading(true);
            try {
                const feedbackData = await geminiService.generateCoachFeedback(session, episode);
                const savedFeedback = await mockApi.saveCoachFeedback(feedbackData);
                setFeedback(savedFeedback);
            } catch (error) {
                console.error("Failed to generate coach feedback:", error);
                // Set some default feedback on error
                setFeedback({
                    sessionId: `err_${Date.now()}`,
                    summary: "Could not retrieve feedback from the AI coach at this time.",
                    strengths: [],
                    improvements: []
                });
            } finally {
                setIsLoading(false);
            }
        };
        generateFeedback();
    }, [session, episode]);

    const handleGenerateTheme = () => {
        // Placeholder for the "Theme Intelligence" feature.
        // This would trigger a call to the agent to create a new theme.
        console.log("Feature coming soon: Generate a visual theme from this session!");
        alert("Feature coming soon: Generate a visual theme from this session!");
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-cyan-400">
                <LoadingIcon size={12} /> 
                <span className="ml-4 text-xl">Generating AI Coach Debrief...</span>
            </div>
        );
    }
    
    if (!feedback) return null; // Or some other error state

    const finalPnl = session.finalPnl;
    const isProfitable = finalPnl >= 0;

    const FeedbackSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
        <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">{icon} {title}</h3>
            <ul className="space-y-2 pl-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900 animate-fade-in">
            <div className="w-full max-w-2xl bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl p-8">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-cyan-300 mb-2">Session Debrief</h1>
                    <p className="text-lg text-gray-400">AI Coach Analysis of Your Performance</p>
                </header>

                <div className="text-center bg-gray-900/50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-400">Total Realized P&L</p>
                    <p className={`text-5xl font-mono font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfitable ? '+' : ''}{finalPnl.toFixed(2)}
                    </p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Coach's Summary</h3>
                    <p className="text-gray-300 italic">"{feedback.summary}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <FeedbackSection title="Strengths" items={feedback.strengths} icon={<CheckCircleIcon />} />
                    <FeedbackSection title="Areas for Improvement" items={feedback.improvements} icon={<XCircleIcon />} />
                </div>

                {feedback.assignedDrillId && (
                     <div className="bg-cyan-900/50 border border-cyan-700 p-4 rounded-lg text-center">
                        <h4 className="font-semibold text-cyan-200">Recommended Drill</h4>
                        <p className="text-cyan-300">To work on your improvements, try the 'Respect the Stop' drill in the Dojo.</p>
                     </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-center mt-8">
                    <button
                        onClick={handleGenerateTheme}
                        className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                        title="Generate a UI theme based on this session's outcome"
                    >
                        <VizLabIcon /> Generate Theme
                    </button>
                    <button
                        onClick={onAcknowledge}
                        className="w-full px-8 py-3 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};
