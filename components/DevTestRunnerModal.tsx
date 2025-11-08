import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { mockApi } from '../../services/mockApi';
import { MockChartData } from '../../services/mockCharting';
import { agentOrchestrator } from '../../services/agentOrchestrator';
import { LoadingIcon, CheckCircleIcon, XCircleIcon, AgentIcon } from './Icons';

type TestStatus = 'pending' | 'running' | 'success' | 'failure';
interface TestLog {
    id: number;
    message: string;
    status: TestStatus;
    details?: string;
    correction?: {
        originalPrompt: string;
        failedOutput: string;
        error: string;
        correctedCode: string;
        isPromoted: boolean;
    }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DevTestRunnerModal: React.FC<{ onClose: () => void; onStartSmokeTest: () => void; }> = ({ onClose, onStartSmokeTest }) => {
    const [isTesting, setIsTesting] = useState(false);
    const [testLogs, setTestLogs] = useState<TestLog[]>([]);

    const addLog = (message: string, status: TestStatus, details?: string) => {
        setTestLogs(prev => [...prev, { id: Date.now(), message, status, details }]);
    };
    
    const updateLastLog = (status: TestStatus, details?: string) => {
        setTestLogs(prev => {
            const newLogs = [...prev];
            const lastLog = newLogs[newLogs.length - 1];
            if(lastLog) {
                lastLog.status = status;
                if(details) lastLog.details = details;
            }
            return newLogs;
        });
    };
    
    const addCorrectionLog = (logId: number, correctionData: TestLog['correction']) => {
        setTestLogs(prev => prev.map(log => log.id === logId ? { ...log, correction: correctionData } : log));
    }
    
    const markCorrectionAsPromoted = (logId: number) => {
        setTestLogs(prev => prev.map(log => {
            if (log.id === logId && log.correction) {
                return { ...log, correction: { ...log.correction, isPromoted: true } };
            }
            return log;
        }));
    };

    const runTests = async () => {
        setIsTesting(true);
        setTestLogs([]);
        await sleep(500);

        // Test 1: Gemini Service
        addLog('Running: Gemini Service Test (Character Gen)', 'running');
        try {
            await geminiService.generateCharacter('test character', [], []);
            await sleep(200);
            updateLastLog('success', 'Successfully generated a character.');
        } catch (e) {
            updateLastLog('failure', e instanceof Error ? e.message : String(e));
        }
        await sleep(500);
        
        // Test 2: Mock API
        addLog('Running: Mock API Test (Strategy CRUD)', 'running');
        try {
            const initialCount = (await mockApi.getStrategies()).length;
            await mockApi.createStrategy({ name: 'Test Strat', description: 'Test', regime: 'range', entryConditions:[], exitConditions:[], riskManagement:[] });
            const finalCount = (await mockApi.getStrategies()).length;
            if (finalCount > initialCount) {
                updateLastLog('success', 'Successfully created and retrieved a strategy.');
            } else {
                throw new Error('Strategy count did not increase after creation.');
            }
        } catch (e) {
             updateLastLog('failure', e instanceof Error ? e.message : String(e));
        }
        await sleep(500);

        // Test 3: Charting Service
        addLog('Running: Charting Service Test (Get Candles)', 'running');
        try {
            const candles = await MockChartData.getAllCandles('TEST', new Date());
            if (candles['1m'] && candles['1m'].length > 0) {
                 updateLastLog('success', `Fetched ${candles['1m'].length} 1m candles successfully.`);
            } else {
                throw new Error('No 1m candles were returned from the service.');
            }
        } catch (e) {
            updateLastLog('failure', e instanceof Error ? e.message : String(e));
        }
        await sleep(500);

        // Test 4: Agent Orchestrator for Campaign Creation
        addLog('Running: Agent Orchestrator Test (Campaign Gen)', 'running');
        try {
            // The orchestrator function requires an addCreatedItem callback. We can mock it for the test.
            const mockAddCreatedItem = () => { console.log('Mock addCreatedItem called during test.'); };
            await agentOrchestrator.createCampaign('A test campaign about a lone wolf trader', mockAddCreatedItem);
            updateLastLog('success', 'Successfully orchestrated campaign creation.');
        } catch (e) {
            updateLastLog('failure', e instanceof Error ? e.message : String(e));
        }
        await sleep(500);

        // Test 5: Self-Correction Loop
        const selfCorrectionLogId = Date.now();
        addLog('Running: Agent Self-Correction Test', 'running');
        const failingPrompt = "Generate a character but with a bio that is an unescaped quote like this: \"I am a bug\". This will fail JSON parsing.";
        let failedOutput = '';
        try {
            // This is expected to fail
            failedOutput = JSON.stringify(await geminiService.generateCharacter(failingPrompt, [], []));
            throw new Error("The generation unexpectedly succeeded. Cannot test self-correction.");
        } catch (e) {
            addLog('INFO: Initial generation failed as expected.', 'running');
            const errorMsg = e instanceof Error ? e.message : String(e);
            
            addLog('Running: Attempting self-correction via Gemini...', 'running');
            try {
                const correction = await geminiService.generateCorrection(failingPrompt, failedOutput, errorMsg);
                updateLastLog('success', `AI proposed a correction.`);
                
                // Now, try to parse the correction
                addLog('Validating correction...', 'running');
                try {
                    JSON.parse(correction); // This is the validation step
                    updateLastLog('success', 'Correction is valid JSON.');
                    setTestLogs(prev => prev.map(log => log.id === selfCorrectionLogId ? { ...log, status: 'success', details: 'Agent successfully corrected its own error.' } : log));
                    addCorrectionLog(selfCorrectionLogId, { 
                        originalPrompt: failingPrompt, 
                        failedOutput, 
                        error: errorMsg,
                        correctedCode: correction,
                        isPromoted: false,
                    });
                } catch (parseError) {
                    updateLastLog('failure', `Correction failed validation: ${parseError}`);
                    setTestLogs(prev => prev.map(log => log.id === selfCorrectionLogId ? { ...log, status: 'failure', details: 'Agent correction was not valid.' } : log));
                }
            } catch (correctionError) {
                updateLastLog('failure', `Self-correction attempt failed: ${correctionError}`);
                 setTestLogs(prev => prev.map(log => log.id === selfCorrectionLogId ? { ...log, status: 'failure', details: 'Agent failed to generate a correction.' } : log));
            }
        }

        setIsTesting(false);
    };
    
    const handlePromoteLesson = async (log: TestLog) => {
        if (!log.correction) return;
        await mockApi.createAgentLesson({
            context: log.correction.originalPrompt,
            correction: `When generating JSON, ensure all string values containing quotes are properly escaped. For example, change '{"bio": "\"I am a bug\""}' to '{"bio": "\\"I am a bug\\""}'.`
        });
        markCorrectionAsPromoted(log.id);
    }

    const LogStatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
        switch(status) {
            case 'running': return <LoadingIcon size={5} className="text-cyan-400" />;
            case 'success': return <CheckCircleIcon size={5} className="text-green-400" />;
            case 'failure': return <XCircleIcon size={5} className="text-red-400" />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 border-2 border-yellow-400/50 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-yellow-300 flex items-center gap-2"><AgentIcon /> Agent Test & Correction Suite</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </header>
                
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold text-gray-200 mb-2">UI Smoke Test</h3>
                        <p className="text-sm text-gray-400 mb-4">Automatically cycles through all UI screens to check for rendering errors or freezes. The app will be unusable until the test is complete.</p>
                        <button 
                            onClick={onStartSmokeTest} 
                            disabled={isTesting}
                            className="w-full py-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-500 disabled:bg-gray-600"
                        >
                            Start UI Smoke Test
                        </button>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-lg">
                        <h3 className="font-semibold text-gray-200 mb-2">API Test Suite</h3>
                        <p className="text-sm text-gray-400 mb-4">Run automated tests against the Gemini API, Mock API, and Charting services. This includes a test of the agent's self-correction capabilities.</p>
                        <button 
                            onClick={runTests} 
                            disabled={isTesting}
                            className="w-full py-3 bg-yellow-500 text-gray-900 font-bold rounded-md hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isTesting ? <><LoadingIcon /> Running API Tests...</> : 'Start API Test Suite'}
                        </button>
                    </div>
                    {testLogs.length > 0 && <div className="border-t border-gray-700 pt-4 mt-4 space-y-3">
                        {testLogs.map((log) => (
                            <div key={log.id}>
                                <div className={`p-3 rounded-lg flex items-start gap-3 ${log.status === 'failure' ? 'bg-red-900/30' : 'bg-gray-900/50'}`}>
                                    <div className="mt-0.5"><LogStatusIcon status={log.status} /></div>
                                    <div>
                                        <p className="font-semibold text-gray-200">{log.message}</p>
                                        {log.details && <p className="text-sm text-gray-400 mt-1">{log.details}</p>}
                                    </div>
                                </div>
                                {log.correction && (
                                    <div className="ml-8 mt-2 p-4 border-l-2 border-purple-500 bg-purple-900/20 rounded-r-lg">
                                        <h4 className="font-bold text-purple-300">Self-Correction Analysis</h4>
                                        <div className="mt-2 space-y-2 text-sm">
                                            <p className="text-gray-400"><strong className="text-gray-200">Error:</strong> A JSON parsing error occurred due to an unescaped quote.</p>
                                            <div>
                                                <p className="text-gray-200 font-semibold">AI's Proposed Correction:</p>
                                                <pre className="p-2 mt-1 bg-black/50 rounded-md text-green-300 text-xs whitespace-pre-wrap">{log.correction.correctedCode}</pre>
                                            </div>
                                            <button 
                                                onClick={() => handlePromoteLesson(log)} 
                                                disabled={log.correction.isPromoted}
                                                className="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                            >
                                                {log.correction.isPromoted ? 'Lesson Learned' : 'Promote to Knowledge Base'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};