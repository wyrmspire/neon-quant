import React from 'react';
import { AgentLog, Theme } from '../../types';
import { SystemIcon, UserIcon, AgentAvatarIcon, ErrorIcon, VizLabIcon } from '../Icons';

const LogItem: React.FC<{ log: AgentLog; availableThemes: Theme[] }> = ({ log, availableThemes }) => {
    const icons = {
        user: <UserIcon />,
        agent: <AgentAvatarIcon />,
        system: <SystemIcon />,
        error: <ErrorIcon />,
    };
    const colors = {
        user: 'bg-gray-700',
        agent: 'bg-gray-800',
        system: 'bg-gray-800 border-l-2 border-cyan-400',
        error: 'bg-red-900/50 border-l-2 border-red-500',
    };

    const suggestedTheme = log.data?.suggestedThemeId
        ? availableThemes.find(t => t.id === log.data.suggestedThemeId)
        : null;

    return (
        <div className={`p-4 rounded-lg flex gap-4 ${colors[log.type]}`}>
            <div className="flex-shrink-0 w-6 h-6 text-cyan-400">{icons[log.type]}</div>
            <div>
                <p className="text-gray-200 whitespace-pre-wrap">{log.message}</p>
                {log.data && (log.type === 'agent') && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded-md border border-gray-600">
                        <h4 className="font-semibold text-cyan-300">Generated Content Details:</h4>
                        {log.data.dataUrl && <img src={log.data.dataUrl} alt="Generated visual asset" className="w-24 h-24 object-cover rounded-md my-2" />}
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                    </div>
                )}
                {suggestedTheme && (
                    <div className="mt-3 p-3 bg-purple-900/30 rounded-md border border-purple-600">
                        <h4 className="font-semibold text-purple-300 flex items-center gap-2"><VizLabIcon size={4} /> Visual Suggestion:</h4>
                        <p className="text-sm text-gray-300 mt-1">I recommend using the <span className="font-bold text-white">"{suggestedTheme.name}"</span> theme for this content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface AgentLogPanelProps {
    logs: AgentLog[];
    logsEndRef: React.RefObject<HTMLDivElement>;
    availableThemes: Theme[];
}

export const AgentLogPanel: React.FC<AgentLogPanelProps> = ({ logs, logsEndRef, availableThemes }) => {
    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-col gap-4">
                {logs.map((log, index) => <LogItem key={index} log={log} availableThemes={availableThemes} />)}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};
