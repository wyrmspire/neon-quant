import { GoogleGenAI, Type } from "@google/genai";
import { Episode, Strategy, AiCharacter, Item, AgentLog } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will show an error in the console.
  // In a real deployed environment, the API_KEY should be set.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

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
        characterBeats: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    t: { type: Type.INTEGER, description: 'Time in seconds from episode start when this beat occurs.' },
                    characterId: { type: Type.STRING, enum: ["mentor", "rival", "fixer"], description: 'The ID of the character speaking.' },
                    dialogue: { type: Type.STRING, description: 'The line of dialogue the character says.' }
                },
                required: ['t', 'characterId', 'dialogue']
            },
            description: 'Narrative moments that happen during the episode.'
        }
    },
    required: ['title', 'description', 'regime', 'seed', 'objectives', 'characterBeats']
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
        }
    },
    required: ['name', 'description', 'regime', 'entryConditions', 'exitConditions', 'riskManagement']
};

const characterSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'A unique and fitting name for the character.' },
        personality: { type: Type.STRING, description: 'A concise description of the character\'s core personality traits and motivations.' },
        bio: { type: Type.STRING, description: 'A short backstory or biography for the character, explaining their role in the world of Neon Quant.' },
        imagePrompt: { type: Type.STRING, description: 'A descriptive prompt for an AI image generator to create a portrait. E.g., "A grizzled veteran trader with a cybernetic eye, looking over a holographic stock chart."' }
    },
    required: ['name', 'personality', 'bio', 'imagePrompt']
};

const itemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'The name of the item.' },
        description: { type: Type.STRING, description: 'A brief, flavorful description of the item and its purpose.' },
        price: { type: Type.INTEGER, description: 'The cost of the item in "Cred", the in-game currency. Should be a reasonable number, e.g., between 100 and 5000.' },
        type: { type: Type.STRING, enum: ["cosmetic", "tool"], description: 'The category of the item.' }
    },
    required: ['name', 'description', 'price', 'type']
};


class GeminiService {
    async generateScenario(prompt: string): Promise<Omit<Episode, 'id' | 'imageUrl' | 'reward'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative game designer for a trading simulation game called 'Project Neon Quant'. Your task is to generate a complete game scenario based on the user's request. The scenario must be a valid JSON object matching the provided schema.

User Request: "${prompt}"

Generate a scenario that fits this request. Ensure the objectives are challenging but fair, and the character beats add to the story and tension.`,
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

    async generateImage(prompt: string): Promise<string> {
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `A high-quality, vibrant digital art image for a trading game. The style is neon-cyberpunk, graphic novel aesthetic. Scene: ${prompt}`,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
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

    async generateStrategy(prompt: string): Promise<Omit<Strategy, 'id'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are an expert trading coach and game designer for 'Project Neon Quant'. Your task is to generate a complete trading strategy based on the user's request. The strategy must be a valid JSON object matching the provided schema. The rules should be clear, concise, and actionable for a player.

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

    async generateCharacter(prompt: string): Promise<Omit<AiCharacter, 'id' | 'imageUrl'> & { imagePrompt: string }> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a creative character designer for a trading simulation game called 'Project Neon Quant'. Your task is to generate a complete character profile based on the user's request. The profile must be a valid JSON object matching the provided schema.

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

    async generateItem(prompt: string): Promise<Omit<Item, 'id'>> {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a game designer for 'Project Neon Quant'. Your task is to generate a complete in-game item based on the user's request. The item must be a valid JSON object matching the provided schema.

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

    async generateChatResponse(prompt: string, history: AgentLog[]): Promise<string> {
        // FIX: The systemInstruction was not a valid template literal, causing numerous parsing errors. This has been corrected by enclosing the entire string content within backticks.
        const systemInstruction = `You are Neon Quant, a helpful AI assistant and game designer for a project named 'Project Neon Quant'. You are an expert on the game's architecture and capabilities.

Here is a summary of the project:
- **Core Concept**: A story-driven, React-based trading game where players role-play as a quant trader.
- **Two Modes**: 
  1.  **Agent Mode**: Your current mode. You interact with the user to design game content.
  2.  **Game Mode**: Where the user can play the game you help design.
- **Your Capabilities**: In Agent Mode, you can be prompted to create four types of game assets:
  1.  **Episodes**: Specific trading scenarios with stories, objectives, and character interactions.
  2.  **Strategies**: Teachable trading playbooks with clear rules.
  3.  **Characters**: NPCs with personalities, backstories, and AI-generated portraits.
  4.  **Items**: In-game objects for the market, either cosmetic or functional.
- **Technical Stack**:
  - The frontend is built with **React** and **Tailwind CSS**.
  - The backend is currently a **mock service** (\`mockApi.ts\`) that simulates **Firestore** and **Google Cloud Storage**. It stores all game data in-memory for this demo.
  - You use the **Gemini API** (\`@google/genai\`) to generate all content. For structured data like episodes or characters, you use JSON mode with a predefined schema. For images, you use the Imagen model. For conversations like this one, you generate freeform text.
- **Game World**:
  - The player has a **Hub** screen which is the central navigation point.
  - From the Hub, they can go to **Episode Select**, the **Market** (to spend 'Cred' currency), or the **Contacts** screen.
  - The core gameplay happens in the **Trading Arena**.

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
}

export const geminiService = new GeminiService();
