import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Theme } from '../../types';
import { LoadingIcon } from '../Icons';
import { SamplePageLayout } from '../ui/SamplePageLayout';

const ControlTextInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = ({ label, value, onChange, placeholder }) => (
     <div>
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full mt-1 p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
    </div>
);

const ComponentEditor: React.FC<{ title: string; classes: string; onClassesChange: (classes: string) => void; children: React.ReactNode }> = ({ title, classes, onClassesChange, children }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cyan-300 border-b border-cyan-300/20 pb-2">{title}</h3>
        <ControlTextInput 
            label="Tailwind Classes"
            value={classes}
            onChange={e => onClassesChange(e.target.value)}
            placeholder="e.g., bg-blue-500 text-white..."
        />
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 min-h-[100px] flex items-center justify-center">
            {children}
        </div>
    </div>
);

export const ThemeStudioSample: React.FC = () => {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form state
    const [themeName, setThemeName] = useState('');
    const [themeDescription, setThemeDescription] = useState('');
    const [buttonClasses, setButtonClasses] = useState('px-6 py-3 rounded-lg shadow-lg bg-cyan-500 text-gray-900 font-semibold');
    const [cardClasses, setCardClasses] = useState('bg-gray-800/50 p-6 rounded-lg border-2 border-gray-700');
    
    const fetchThemes = async () => {
        setIsLoading(true);
        const data = await mockApi.getThemes();
        setThemes(data);
        setIsLoading(false);
    };
    
    useEffect(() => {
        fetchThemes();
    }, []);

    const handleSaveTheme = async () => {
        if (!themeName.trim() || !themeDescription.trim()) {
            alert('Please provide a name and description for the theme.');
            return;
        }
        const newTheme: Omit<Theme, 'id'> = {
            name: themeName,
            description: themeDescription,
            styles: {
                button: { classes: buttonClasses },
                card: { classes: cardClasses },
            }
        };
        await mockApi.createTheme(newTheme);
        setThemeName('');
        setThemeDescription('');
        fetchThemes(); // Refresh list
    };
    
    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><LoadingIcon size={12} /></div>;
    }

    return (
        <SamplePageLayout
            title="Theme Studio"
            description="Design and save collections of component styles as reusable themes."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full w-full max-w-7xl">
                {/* Left Pane: Editor */}
                <div className="md:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col gap-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white">Theme Editor</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg">
                        <ControlTextInput label="Theme Name" value={themeName} onChange={e => setThemeName(e.target.value)} placeholder="e.g., Solar Flare" />
                        <ControlTextInput label="Theme Description" value={themeDescription} onChange={e => setThemeDescription(e.target.value)} placeholder="Aggressive and bold" />
                    </div>

                    <ComponentEditor title="Button Style" classes={buttonClasses} onClassesChange={setButtonClasses}>
                         <button className={buttonClasses}>Styled Button</button>
                    </ComponentEditor>

                     <ComponentEditor title="Card Style" classes={cardClasses} onClassesChange={setCardClasses}>
                        <div className={cardClasses}>
                            <p className="text-white">Styled Card</p>
                        </div>
                    </ComponentEditor>
                    
                    <button onClick={handleSaveTheme} className="w-full mt-4 py-3 bg-green-600 font-bold rounded-md hover:bg-green-500">
                        Save New Theme
                    </button>
                </div>

                {/* Right Pane: Saved Themes */}
                <div className="md:col-span-1 bg-gray-800/50 p-6 rounded-lg border border-gray-700 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Saved Themes</h2>
                    <div className="space-y-4">
                        {themes.map(theme => (
                            <div key={theme.id} className="p-4 bg-gray-700/50 rounded-lg">
                                <h3 className="font-semibold text-purple-300">{theme.name}</h3>
                                <p className="text-sm text-gray-400">{theme.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SamplePageLayout>
    );
};