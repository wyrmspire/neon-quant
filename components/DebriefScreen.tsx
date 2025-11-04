import React from 'react';
import { Session, CoachFeedback } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './Icons';

interface DebriefScreenProps {
    session: Session;
    feedback: CoachFeedback;
    onAcknowledge: () => void;
}

export const DebriefScreen: React.FC<DebriefScreenProps> = ({ session, feedback, onAcknowledge }) => {
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

                <div className="text-center mt-8">
                    <button
                        onClick={onAcknowledge}
                        className="px-8 py-3 bg-cyan-500 text-gray-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};