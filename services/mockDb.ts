// Fix: Corrected import path for types and added AgentLesson.
import { Episode, AiCharacter, Profile, Strategy, Item, Drill, CoachFeedback, VisualAsset, Theme, JournalEntry, AgentLesson, Campaign } from '../types';

// Define the structure of our database
export interface Db {
  episodes: Episode[];
  characters: AiCharacter[];
  profile: Profile;
  strategies: Strategy[];
  items: Item[];
  drills: Drill[];
  coachFeedback: CoachFeedback[];
  visualAssets: VisualAsset[];
  themes: Theme[];
  journal: JournalEntry[];
  agentLessons: AgentLesson[];
  campaigns: Campaign[];
}

// Define the key for localStorage
const DB_KEY = "neon-quant-db:v1";

// Default data to seed the database if it's empty
const defaultDb: Db = {
    episodes: [
        {
            id: 'ep1',
            title: "Night of the CPI",
            description: "A volatile news event is about to drop. Keep your cool and trade the reaction, not the headline.",
            regime: "news",
            seed: "NEWS:CPI_SPIKE",
            objectives: ["<=1.0R max DD", "Tag every trade", "Take <= 3 trades"],
            imageUrl: "https://picsum.photos/seed/ep1/600/400",
            reward: 500,
        },
        {
            id: 'ep2',
            title: "The Chop Shop",
            description: "The market is a ranging mess. Your job is to avoid getting chopped up. Scalp the edges or sit on your hands.",
            regime: "range",
            seed: "RANGE:WIDE_CHOP",
            objectives: ["No trades in the middle 50% of range", "Achieve 1.5R total", "End with positive P&L"],
            imageUrl: "https://picsum.photos/seed/ep2/600/400",
            reward: 350,
        }
    ],
    characters: [
        { id: 'mentor', name: 'Kai', personality: 'A calm, process-oriented veteran trader who values risk management above all else.', imageUrl: 'https://picsum.photos/seed/kai/200/200', bio: 'Kai has seen it all and believes that a solid process is the only thing that separates gamblers from traders.' },
        { id: 'rival', name: 'Zane', personality: 'A cocky, P&L-driven trader who loves to brag and takes big risks.', imageUrl: 'https://picsum.photos/seed/zane/200/200', bio: 'Zane lives for the thrill of the trade and has a flashy apartment to show for it. He thinks rules are for the timid.' },
        { id: 'fixer', name: 'Silas', personality: 'A shadowy figure who offers tempting shortcuts and morally ambiguous tips.', imageUrl: 'https://picsum.photos/seed/silas/200/200', bio: 'No one knows where Silas gets his information, but it always seems to be one step ahead of the market. His help comes at a price.' }
    ],
    profile: {
        handle: "PlayerOne",
        tier: "novice",
        unlockedEpisodes: ["ep1"],
        cred: 1200,
        inventory: ['item1'],
        settings: { dailyLossLimit: 1000, autoLock: true }
    },
    strategies: [
        {
            id: 'strat1',
            name: 'Beginner Trend Pullback',
            description: 'A simple strategy for beginners to catch pullbacks in an established trend. Wait for the price to pull back, then enter in the direction of the trend.',
            regime: 'trend',
            entryConditions: [
                'Identify a clear uptrend or downtrend.',
                'Wait for price to pull back to a key support/resistance level.',
                'Enter on a confirmation candle in the trend\'s direction.'
            ],
            exitConditions: [
                'Take profit at the next major level.',
                'Exit if the trend structure is broken.'
            ],
            riskManagement: [
                'Place stop-loss behind the pullback structure.',
                'Risk no more than 1R per trade.'
            ]
        }
    ],
    items: [
        { id: 'item1', name: 'Neon Bonsai', description: 'A stylish, glowing bonsai tree for your desk. Purely cosmetic, but it really ties the room together.', price: 750, type: 'cosmetic' },
        { id: 'item2', name: 'Advanced Charting Suite', description: 'Unlocks additional indicators and drawing tools in the Trading Arena.', price: 2500, type: 'tool' },
        { id: 'item3', name: 'Rival Taunt Pack', description: 'Get a new set of taunts from Zane when you outperform him.', price: 300, type: 'cosmetic' },
    ],
    drills: [
        {
            id: 'drill1',
            name: 'Respect the Stop',
            description: 'Practice setting and honoring your stop-loss. In this drill, you must exit every trade at your planned stop-loss level or better.',
            detectionRule: 'exit_at_planned_stop',
            scenarioSeed: 'TREND:UP_WITH_PULLBACKS',
            successCriteria: { metric: 'slippage', op: 'lt', value: 2, label: 'Average slippage < 2 ticks' },
        }
    ],
    coachFeedback: [],
    visualAssets: [],
    themes: [
        {
            id: 'theme1',
            name: 'Cyber-Neon',
            description: 'The default theme. High-contrast cyan on a dark background.',
            styles: {
                button: { classes: 'px-6 py-3 rounded-lg shadow-lg bg-cyan-500 text-gray-900 font-semibold transition-all duration-200 hover:bg-cyan-400 active:scale-95' },
                card: { classes: 'bg-gray-800/50 p-6 rounded-lg border-2 border-gray-700' },
            }
        }
    ],
    journal: [],
    agentLessons: [],
    campaigns: [
        {
            id: 'welcome_campaign',
            title: "Welcome to Neon Quant",
            description: "A starter campaign to introduce you to the core concepts of the game.",
            nodes: [
                { id: 'node1', type: 'story', title: 'The Invitation', content: "You receive a cryptic message on your terminal. It's an invitation to an exclusive trading league known only as 'Neon Quant'. This is your chance to make a name for yourself.", position: { x: 50, y: 100 } },
                { id: 'node2', type: 'story', title: 'First Contact', content: "Your first contact is Kai, a veteran trader. He warns you that the markets are a battlefield, and process is your only armor.", position: { x: 300, y: 100 } },
            ],
            links: [
                { id: 'link1', sourceId: 'node1', targetId: 'node2' }
            ]
        }
    ]
};

// In-memory cache for the database to avoid repeated, expensive localStorage reads.
let _dbCache: Db | null = null;

// Function to save the DB to localStorage AND update the in-memory cache.
function save(db: Db) {
    _dbCache = db;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Function to load the DB from localStorage, falling back to default.
// It now uses the cache to ensure the expensive JSON.parse() only happens once.
function load(): Db {
    // If cache is populated, return it immediately.
    if (_dbCache) {
        return _dbCache;
    }

    try {
        const storedDb = localStorage.getItem(DB_KEY);
        if (storedDb) {
            const parsedDb = JSON.parse(storedDb);
            // Basic validation to ensure all keys from defaultDb exist
            const allKeysExist = Object.keys(defaultDb).every(key => key in parsedDb);
            if(allKeysExist) {
                _dbCache = parsedDb; // Cache the loaded DB
                return _dbCache;
            }
        }
    } catch (e) {
        console.error("Failed to parse DB from localStorage, resetting.", e);
        // If parsing fails, we'll fall through and use the default DB
    }
    
    // If no stored DB, or it's malformed, save and return the default one.
    // The save function will also populate the cache.
    save(defaultDb);
    return defaultDb;
}

// The mockDb service object
export const mockDb = {
    /**
     * Reads the database. Returns a cached in-memory object after the first read
     * to prevent expensive re-parsing of the localStorage string on subsequent calls.
     */
    read(): Db {
        return load();
    },
    /**
     * Mutates the database. It loads the current state (from cache if available),
     * applies the mutation, and then saves it back to localStorage and the cache.
     */
    write(mutator: (db: Db) => void) {
        const db = load();
        mutator(db);
        save(db);
    },
    /**
     * Resets the database to its default state in both localStorage and the cache.
     */
    reset() {
        save(defaultDb);
    }
};