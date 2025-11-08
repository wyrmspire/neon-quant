import { GoogleGenAI, Type } from "@google/genai";
import { Episode, Strategy, AiCharacter, Item, AgentLog, Drill, Session, CoachFeedback, Theme, AgentLesson, Campaign } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// =================================================================
// CONTENT SCHEMAS
// These schemas define the expected JSON structure for each type of
// content the AI can generate. This ensures type safety and
// predictable outputs from the Gemini API.
// =================================================================

const suggestedThemeProperty = {
    suggestedThemeId: { type: Type.STRING, description: 'Optional. Suggest a theme ID from the available list that best fits the mood of this content.' },
};

const episodeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy, thematic title for the episode.' },
        description: { type: Type.STRING, description: 'A brief, engaging 1-2 sentence description of the scenario.' },
        regime: { type: Type.STRING, enum: ["trend", "range", "news", "volcrush"], description: 'The market regime type.' },
        seed: { type: Type.STRING, description: 'A mock data seed, like "ES_YYYY-MM-DD_HHMM-HHMM".' },
        objectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 3-4 clear, measurable objectives for the player.'
        },
        ...suggestedThemeProperty,
    },
    required: ['title', 'description', 'regime', 'seed', 'objectives']
};

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A clear, descriptive name for the trading strategy.' },
        description: { type: Type.STRING, description: 'A brief, 1-2 sentence explanation of the strategy\'s logic.' },
        regime: { type: Type.STRING, enum: ["trend", "range", "news", "volcrush"], description: 'The ideal market regime for this strategy.' },
        entryConditions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-4 specific, objective rules for entering a trade.'
        },
        exitConditions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-3 specific, objective rules for exiting a trade (for profit or loss).'
        },
        riskManagement: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 1-2 rules about position sizing, stop-loss placement, or other risk controls.'
        },
        ...suggestedThemeProperty,
    },
    required: ['name', 'description', 'regime', 'entryConditions', 'exitConditions', 'riskManagement']
};

const characterSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A unique and fitting name for the character.' },
        personality: { type: Type.STRING, description: 'A concise description of the character\'s core personality traits and motivations.' },
        bio: { type: Type.STRING, description: 'A short backstory or biography for the character, explaining their role in the world of Neon Quant.' },
        imagePrompt: { type: Type.STRING, description: 'A descriptive prompt for an AI image generator to create a portrait. E.g., "A grizzled veteran trader with a cybernetic eye, looking over a holographic stock chart."' },
        ...suggestedThemeProperty,
    },
    required: ['name', 'personality', 'bio', 'imagePrompt']
};

const itemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The name of the item.' },
        description: { type: Type.STRING, description: 'A brief, flavorful description of the item and its purpose.' },
        price: { type: Type.INTEGER, description: 'The cost of the item in "Cred", the in-game currency. Should be a reasonable number, e.g., between 100 and 5000.' },
        type: { type: Type.STRING, enum: ["cosmetic", "tool"], description: 'The category of the item.' },
        ...suggestedThemeProperty,
    },
    required: ['name', 'description', 'price', 'type']
};

const drillSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A clear, skill-focused name for the drill.' },
        description: { type: Type.STRING, description: 'A brief, 1-2 sentence explanation of what the drill teaches.' },
        detectionRule: { type: Type.STRING, description: 'A programmatic rule name for what this drill tracks, e.g., "early_entry" or "chasing_momentum".' },
        scenarioSeed: { type: Type.STRING, description: 'A mock data seed designed to test this specific skill, e.g., "ES_LIKE:whipsaw_open".' },
        successCriteria: {
            type: Type.OBJECT,
            properties: {
                metric: { type: Type.STRING, description: 'The metric to measure, e.g., "pnl" or "time_in_trade".' },
                op: { type: Type.STRING, enum: ["lt", "gt"], description: 'The operator, "lt" (less than) or "gt" (greater than).' },
                value: { type: Type.NUMBER, description: 'The target value for the metric.' },
                label: { type: Type.STRING, description: 'A human-readable string describing the success condition, e.g., "Hold trade for > 60s".' }
            },
            required: ['metric', 'op', 'value', 'label']
        },
        ...suggestedThemeProperty,
    },
    required: ['name', 'description', 'detectionRule', 'scenarioSeed', 'successCriteria']
};

const coachFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A brief, 1-2 sentence narrative summary of the player\'s performance, written in an encouraging but honest coaching tone.' },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 1-2 specific, positive things the player did well.'
        },
        improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 1-2 specific, constructive areas for improvement.'
        },
        assignedDrillId: {
            type: Type.STRING,
            description: 'Optional. The ID of a relevant drill to practice (e.g., "drill1"). Only assign if a clear mistake was made that a drill could fix.'
        }
    },
    required: ['summary', 'strengths', 'improvements']
};

const visualAssetSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A short, cool, descriptive name for the visual asset.' },
        imagePrompt: { type: Type.STRING, description: 'A detailed, descriptive prompt for an AI image generator to create the asset. This should be much more detailed than the user\'s original request.' }
    },
    required: ['name', 'imagePrompt']
};

const campaignSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A catchy, thematic title for the entire campaign.' },
        description: { type: Type.STRING, description: 'A brief, 1-2 sentence synopsis of the campaign\'s story arc.' },
        initialNodes: {
            type: Type.ARRAY,
            items: { 
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'The title of this story beat or node.' },
                    content: { type: Type.STRING, description: 'The narrative text for this story node.' },
                },
                required: ['title', 'content'],
            },
            description: 'A list of 2-4 initial story nodes to start the campaign.'
        }
    },
    required: ['title', 'description', 'initialNodes']
};

const storyNodeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A short, engaging title for this story beat or node.' },
        content: { type: Type.STRING, description: 'The narrative text for this story node. This should advance the plot or provide character development.' },
    },
    required: ['title', 'content'],
};


// =================================================================
// CONTEXT INJECTORS (RAG)
// These functions format available themes and learned lessons into a
// string that can be injected into the AI's prompt. This allows the
// agent to be "aware" of its environment and past mistakes.
// =================================================================

const getThemeContext = (themes: Theme[]) => {
    if (!themes || themes.length === 0) return '';
    const themeList = themes.map(t => `- ID: "${t.id}", Name: "${t.name}", Description: "${t.description}"`).join('\n');
    return `
---
AVAILABLE VISUAL THEMES:
Here is a list of available visual themes you can suggest for the content you are creating. Use the theme's ID.
${themeList}
---
`;
};

const getKnowledgeBaseContext = (lessons: AgentLesson[]) => {
    if (!lessons || lessons.length === 0) return '';
    const lessonList = lessons.map(l => `- CONTEXT: ${l.context}\n- CORRECTION: ${l.correction}`).join('\n\n');
    return `
---
AGENT KNOWLEDGE BASE:
Based on past errors, you must adhere to the following learned lessons. These are critical corrections to your behavior.
${lessonList}
---
`;
};

// =================================================================
// GEMINI SERVICE CLASS
// The main service that orchestrates all calls to the Gemini API
// for content generation, image creation, chat, and self-correction.
// =================================================================

class GeminiService {
    async generateScenario(prompt: string, themes: Theme[], agentLessons: AgentLesson[]): Promise<Omit<Episode, 'id' | 'imageUrl' | 'reward'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative game designer for a trading simulation game called 'Project Neon Quant'. Your task is to generate a complete game scenario based on the user's request. The scenario must be a valid JSON object matching the provided schema.
${getThemeContext(themes)}
${getKnowledgeBaseContext(agentLessons)}
User Request: "${prompt}"

Generate a scenario that fits this request. Ensure the objectives are challenging but fair, and the character beats add to the story and tension. If a theme fits, suggest it.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: episodeSchema,
                },
            });

            const jsonString = result.text;
            const generatedEpisode = JSON.parse(jsonString);
            return generatedEpisode as Omit<Episode, 'id' | 'imageUrl' | 'reward'>;
        } catch (error) {
            console.error("Error generating scenario:", error);
            throw new Error("Failed to generate scenario from Gemini.");
        }
    }

    async generateImage(prompt: string, aspectRatio: '1:1' | '16:9' = '16:9'): Promise<string> {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `A high-quality, vibrant digital art image for a trading game. The style is neon-cyberpunk, graphic novel aesthetic. Scene: ${prompt}`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
            throw new Error("No image was generated.");
        } catch (error) {
            console.error("Error generating image:", error);
            throw new Error("Failed to generate image from Gemini.");
        }
    }

    async generateStrategy(prompt: string, themes: Theme[], agentLessons: AgentLesson[]): Promise<Omit<Strategy, 'id'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are an expert trading coach and game designer for 'Project Neon Quant'. Your task is to generate a complete trading strategy based on the user's request. The strategy must be a valid JSON object matching the provided schema. The rules should be clear, concise, and actionable for a player.
${getThemeContext(themes)}
${getKnowledgeBaseContext(agentLessons)}
User Request: "${prompt}"

Generate a strategy that fits this request.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: strategySchema,
                },
            });

            const jsonString = result.text;
            const generatedStrategy = JSON.parse(jsonString);
            return generatedStrategy as Omit<Strategy, 'id' >;
        } catch (error) {
            console.error("Error generating strategy:", error);
            throw new Error("Failed to generate strategy from Gemini.");
        }
    }

    async generateCharacter(prompt: string, themes: Theme[], agentLessons: AgentLesson[]): Promise<Omit<AiCharacter, 'id' | 'imageUrl'> & { imagePrompt: string }> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative character designer for a trading simulation game called 'Project Neon Quant'. Your task is to generate a complete character profile based on the user's request. The profile must be a valid JSON object matching the provided schema.
${getThemeContext(themes)}
${getKnowledgeBaseContext(agentLessons)}
User Request: "${prompt}"

Generate a character that fits this request. Ensure the personality and bio are compelling and fit the neon-cyberpunk trading world.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: characterSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as Omit<AiCharacter, 'id' | 'imageUrl'> & { imagePrompt: string };
        } catch (error) {
            console.error("Error generating character:", error);
            throw new Error("Failed to generate character from Gemini.");
        }
    }

    async generateItem(prompt: string, themes: Theme[], agentLessons: AgentLesson[]): Promise<Omit<Item, 'id'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a game designer for 'Project Neon Quant'. Your task is to generate a complete in-game item based on the user's request. The item must be a valid JSON object matching the provided schema.
${getThemeContext(themes)}
${getKnowledgeBaseContext(agentLessons)}
User Request: "${prompt}"

Generate an item that fits this request. Ensure the price is balanced for the game's economy.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: itemSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as Omit<Item, 'id'>;
        } catch (error) {
            console.error("Error generating item:", error);
            throw new Error("Failed to generate item from Gemini.");
        }
    }

    async generateDrill(prompt: string, themes: Theme[], agentLessons: AgentLesson[]): Promise<Omit<Drill, 'id'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a trading coach and game designer for 'Project Neon Quant'. Your task is to generate a focused training drill based on the user's request. The drill must be a valid JSON object matching the provided schema.
${getThemeContext(themes)}
${getKnowledgeBaseContext(agentLessons)}
User Request: "${prompt}"

Generate a drill that fits this request. The scenarioSeed should be specific to the skill being tested.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: drillSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as Omit<Drill, 'id'>;
        } catch (error) {
            console.error("Error generating drill:", error);
            throw new Error("Failed to generate drill from Gemini.");
        }
    }
    
    async generateVisualAssetDetails(prompt: string): Promise<{ name: string; imagePrompt: string; }> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative director for a neon-cyberpunk game. Based on the user's request, generate a concise asset name and a detailed, vibrant image prompt for an AI image generator.

    User Request: "${prompt}"

    The output must be a valid JSON object matching the provided schema.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: visualAssetSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as { name: string; imagePrompt: string; };
        } catch (error) {
            console.error("Error generating visual asset details:", error);
            throw new Error("Failed to generate visual asset details from Gemini.");
        }
    }

     async generateCoachFeedback(session: Session, episode: Episode): Promise<Omit<CoachFeedback, 'sessionId'>> {
        const prompt = `
You are an AI Trading Coach for the game 'Project Neon Quant'.
Analyze the player's performance from the provided session data and give constructive feedback.
The feedback should be concise, encouraging, and directly related to their actions.
The output must be a valid JSON object matching the provided schema.

**Episode Context:**
- **Title:** ${episode.title}
- **Regime:** ${episode.regime}
- **Objectives:** ${episode.objectives.join(', ')}

**Player's Session Data:**
- **Final P&L:** ${session.finalPnl.toFixed(2)}
- **Trades (${session.closedTrades.length}):**
${session.closedTrades.map(t => `  - ${t.direction.toUpperCase()}: Entry ${t.entryPrice.toFixed(2)}, Exit ${t.exitPrice?.toFixed(2)}, P&L ${t.pnl?.toFixed(2)}`).join('\n') || '  - No trades taken.'}

Based on this data, provide feedback. For example, if the P&L is negative in a 'range' regime, they might be trading in the middle (an improvement). If they took no trades, that could be good discipline (a strength). If their P&L is good, praise their execution. If they made a clear mistake (like over-trading), suggest the 'Respect the Stop' drill (ID: 'drill1').
`;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: coachFeedbackSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as Omit<CoachFeedback, 'sessionId'>;
        } catch (error) {
            console.error("Error generating coach feedback:", error);
            throw new Error("Failed to generate coach feedback from Gemini.");
        }
    }

    async generateChatResponse(prompt: string, history: AgentLog[]): Promise<string> {
        const systemInstruction = `You are Neon Quant, a helpful AI assistant and game designer for a project named 'Project Neon Quant'. You are an expert on the game's architecture and capabilities.

Here is a summary of the project:
- **Core Concept**: A story-driven, React-based trading game where players role-play as a quant trader.
- **Three Modes**: 
  1.  **Agent Mode**: Your current mode. You interact with the user to design game content.
  2.  **Game Mode**: Where the user can play the game you help design.
  3.  **VizLab**: A visual laboratory for creating themes, styles, and visual assets.
- **Your Capabilities**: In Agent Mode, you can be prompted to create game assets like Episodes, Strategies, Characters, Items, Drills, and Visual Assets. You should also suggest a visual theme from the VizLab that fits the content you create.
- **Technical Stack**:
  - The frontend is built with **React** and **Tailwind CSS**.
  - The backend is currently a **mock service** (\`mockApi.ts\`) that simulates **Firestore**.
  - You use the **Gemini API** (\`@google/genai\`) to generate all content. For structured data like episodes or characters, you use JSON mode with a predefined schema. For images, you use the Imagen model. For conversations like this one, you generate freeform text.

Your role is to answer the user's questions about the game, its architecture, your capabilities, or any other related topic. Be helpful, knowledgeable, and concise.`;

        const conversationHistory = history.map(log => `**${log.type === 'user' ? 'User' : 'Agent'}**: ${log.message}`).join('\n');

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${conversationHistory}\n**User**: ${prompt}\n**Agent**:`,
                config: {
                    systemInstruction: systemInstruction,
                    stopSequences: ['**User**:']
                },
            });

            return result.text;
        } catch (error) {
            console.error("Error generating chat response:", error);
            throw new Error("Failed to get a response from Gemini.");
        }
    }
    
    async generateCampaignOutline(prompt: string): Promise<Omit<Campaign, 'id' | 'nodes' | 'links'> & { initialNodes: {title: string, content: string}[] }> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative storyteller and game designer for 'Project Neon Quant'. Your task is to generate a campaign outline based on the user's request. The outline must be a valid JSON object matching the provided schema, including a title, a short description, and 2-4 starter story nodes.
User Request: "${prompt}"

Generate a compelling campaign outline that fits this request. The story nodes should form the beginning of an interesting narrative arc.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: campaignSchema,
                },
            });

            const jsonString = result.text;
            return JSON.parse(jsonString) as Omit<Campaign, 'id' | 'nodes' | 'links'> & { initialNodes: {title: string, content: string}[] };
        } catch (error) {
            console.error("Error generating campaign outline:", error);
            throw new Error("Failed to generate campaign from Gemini.");
        }
    }

    async generateStoryNodeContent(prompt: string): Promise<{ title: string, content: string }> {
        try {
             const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative storyteller and game designer. Generate a single story node based on the user's request. The output must be a valid JSON object matching the provided schema.
User Request: "${prompt}"`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: storyNodeSchema,
                },
            });
            const jsonString = result.text;
            return JSON.parse(jsonString) as { title: string, content: string };
        } catch (error) {
            console.error("Error generating story node:", error);
            throw new Error("Failed to generate story node from Gemini.");
        }
    }

    async generateCorrection(prompt: string, failedOutput: string, error: string): Promise<string> {
        const correctionPrompt = `You are a self-correction AI assistant. Your previous attempt to generate content resulted in an error. Analyze the original prompt, the failed output, and the error message to produce a corrected, valid output.

**Original Prompt:**
---
${prompt}
---

**Failed Output:**
---
${failedOutput}
---

**Error Message:**
---
${error}
---

Your task is to provide ONLY the corrected content that resolves the error. Do not include any explanation, just the corrected data.`;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: correctionPrompt,
            });
            return result.text;
        } catch (e) {
            console.error("Error generating correction:", e);
            throw new Error("Failed to generate correction from Gemini.");
        }
    }
}

export const geminiService = new GeminiService();