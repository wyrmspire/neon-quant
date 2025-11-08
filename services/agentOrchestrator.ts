import { geminiService } from './geminiService';
import { mockApi } from './mockApi';
import { AgentLog, CreationType, Theme, AgentLesson, AiCharacter, AssetType, Campaign, CampaignNode, VisualAsset, Episode, Strategy, Item, Drill } from '../types';

type LogCallback = (log: AgentLog) => void;

interface HandlePromptArgs {
    prompt: string;
    creationType: CreationType;
    context?: { campaign?: Campaign };
    themes: Theme[];
    agentLessons: AgentLesson[];
    addCreatedItem: <T extends AssetType>(item: T, type: CreationType) => void;
    updateCampaign: (campaign: Campaign) => void;
    history: AgentLog[];
    logCallback: LogCallback;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AgentOrchestrator {
    
    // =================================================================
    // MULTI-STEP PLANS
    // These methods represent complex, multi-step goals for the agent.
    // =================================================================

    private async createCharacter(prompt: string, themes: Theme[], lessons: AgentLesson[], log: LogCallback): Promise<AiCharacter> {
        log({ type: 'system', message: 'Executing plan: Create Character with Portrait', action: 'thinking' });
        await sleep(500);

        log({ type: 'system', message: 'Step 1: Generating character details...', action: 'generating_data' });
        const charData = await geminiService.generateCharacter(prompt, themes, lessons);
        log({ type: 'agent', message: `Generated character data for: ${charData.name}`, data: charData });
        await sleep(500);

        log({ type: 'system', message: 'Step 2: Generating portrait image...', action: 'generating_image' });
        const charImageUrl = await geminiService.generateImage(charData.imagePrompt, '1:1');
        log({ type: 'agent', message: 'Generated portrait.', data: { dataUrl: charImageUrl.slice(0, 50) + '...' } });
        await sleep(500);

        log({ type: 'system', message: 'Step 3: Saving character to database...', action: 'saving_to_db' });
        const newCharacter = await mockApi.createCharacter({ ...charData, imageUrl: charImageUrl });
        log({ type: 'system', message: `Character "${newCharacter.name}" saved successfully.` });
        
        return newCharacter;
    }

    public async createVisualAsset(userPrompt: string, imageGenPrompt: string, type: VisualAsset['type'], log?: LogCallback): Promise<VisualAsset> {
        log?.({ type: 'system', message: 'Executing plan: Create Visual Asset', action: 'thinking' });
        await sleep(500);

        log?.({ type: 'system', message: 'Step 1: Generating asset details...', action: 'generating_data' });
        const assetDetails = await geminiService.generateVisualAssetDetails(userPrompt);
        log?.({ type: 'agent', message: `Generated asset details for: ${assetDetails.name}`, data: assetDetails });
        await sleep(500);

        log?.({ type: 'system', message: 'Step 2: Generating image...', action: 'generating_image' });
        const assetImageUrl = await geminiService.generateImage(imageGenPrompt, type === 'avatar' ? '1:1' : '16:9');
        log?.({ type: 'agent', message: 'Generated image.', data: { dataUrl: assetImageUrl.slice(0, 50) + '...' } });
        await sleep(500);

        log?.({ type: 'system', message: 'Step 3: Saving asset to database...', action: 'saving_to_db' });
        const newAsset = await mockApi.createVisualAsset({
            type,
            name: assetDetails.name,
            prompt: userPrompt,
            dataUrl: assetImageUrl,
        });
        log?.({ type: 'system', message: `Asset "${newAsset.name}" saved successfully.` });

        return newAsset;
    }

    private async createEpisode(prompt: string, themes: Theme[], lessons: AgentLesson[], log: LogCallback): Promise<Episode> {
        log({ type: 'system', message: 'Executing plan: Create Episode', action: 'thinking' });
        await sleep(500);

        log({ type: 'system', message: 'Step 1: Generating episode data...', action: 'generating_data' });
        const episodeData = await geminiService.generateScenario(prompt, themes, lessons);
        log({ type: 'agent', message: `Generated data for episode: "${episodeData.title}"`, data: episodeData });
        await sleep(500);

        log({ type: 'system', message: 'Step 2: Generating episode image...', action: 'generating_image' });
        const imageUrl = await geminiService.generateImage(`Episode art for: ${episodeData.title}. ${episodeData.description}`);
        log({ type: 'agent', message: 'Generated episode art.', data: { dataUrl: imageUrl.slice(0, 50) + '...' } });
        await sleep(500);

        log({ type: 'system', message: 'Step 3: Saving episode to database...', action: 'saving_to_db' });
        const newEpisode = await mockApi.createEpisode({ ...episodeData, imageUrl });
        log({ type: 'system', message: `Episode "${newEpisode.title}" saved successfully.` });

        return newEpisode;
    }
    
    private async createSimpleAsset<T extends Strategy | Item | Drill>(
        type: 'strategy' | 'item' | 'drill',
        prompt: string,
        themes: Theme[],
        lessons: AgentLesson[],
        log: LogCallback
    ): Promise<T> {
        log({ type: 'system', message: `Executing plan: Create ${type}`, action: 'thinking' });
        await sleep(500);

        log({ type: 'system', message: `Step 1: Generating ${type} data...`, action: 'generating_data' });
        let assetData: any;
        if (type === 'strategy') assetData = await geminiService.generateStrategy(prompt, themes, lessons);
        else if (type === 'item') assetData = await geminiService.generateItem(prompt, themes, lessons);
        else assetData = await geminiService.generateDrill(prompt, themes, lessons);
        log({ type: 'agent', message: `Generated data for: "${assetData.name}"`, data: assetData });
        await sleep(500);

        log({ type: 'system', message: `Step 2: Saving ${type} to database...`, action: 'saving_to_db' });
        let newAsset: any;
        if (type === 'strategy') newAsset = await mockApi.createStrategy(assetData);
        else if (type === 'item') newAsset = await mockApi.createItem(assetData);
        else newAsset = await mockApi.createDrill(assetData);
        log({ type: 'system', message: `${type.charAt(0).toUpperCase() + type.slice(1)} "${newAsset.name}" saved successfully.` });
        
        return newAsset as T;
    }


    public async createCampaign(prompt: string): Promise<Campaign> {
        const campaignData = await geminiService.generateCampaignOutline(prompt);
        const nodes: CampaignNode[] = campaignData.initialNodes.map((node, index) => ({
            ...node,
            id: `node-${v4()}`,
            type: 'story',
            position: { x: 50 + index * 250, y: 100 },
        }));
        
        const newCampaign = await mockApi.createCampaign({
            title: campaignData.title,
            description: campaignData.description,
            nodes: nodes,
            links: [], // No links initially
        });
        return newCampaign;
    }
    
    public async addStoryNodeToCampaign(prompt: string, campaign: Campaign): Promise<Campaign> {
        const nodeContent = await geminiService.generateStoryNodeContent(prompt);
        const newNode: CampaignNode = {
            ...nodeContent,
            id: `node-${v4()}`,
            type: 'story',
            // Position the new node after the last one
            position: { x: 50 + campaign.nodes.length * 250, y: 100 }
        };
        const updatedCampaign = { ...campaign, nodes: [...campaign.nodes, newNode] };
        await mockApi.updateCampaign(updatedCampaign);
        return updatedCampaign;
    }
    
    public async regenerateNodeContent(node: CampaignNode, campaign: Campaign): Promise<Campaign> {
        const prompt = `Regenerate this story node with a different take, keeping the same core idea.\n\nOriginal Title: ${node.title}\nOriginal Content: ${node.content}`;
        const newContent = await geminiService.generateStoryNodeContent(prompt);
        const updatedNodes = campaign.nodes.map(n => n.id === node.id ? { ...n, ...newContent } : n);
        const updatedCampaign = { ...campaign, nodes: updatedNodes };
        await mockApi.updateCampaign(updatedCampaign);
        return updatedCampaign;
    }
    

    // =================================================================
    // MAIN PROMPT HANDLER
    // The entry point that delegates to the correct plan or action.
    // =================================================================

    async handlePrompt(args: HandlePromptArgs): Promise<void> {
        const { prompt, creationType, context, themes, agentLessons, addCreatedItem, updateCampaign, history, logCallback } = args;

        try {
            switch (creationType) {
                case 'chat':
                    const chatResponse = await geminiService.generateChatResponse(prompt, history);
                    logCallback({ type: 'agent', message: chatResponse, action: 'responding' });
                    break;
                
                case 'character':
                    const newCharacter = await this.createCharacter(prompt, themes, agentLessons, logCallback);
                    addCreatedItem(newCharacter, 'character');
                    logCallback({ type: 'agent', message: `Character "${newCharacter.name}" is now available.`, action: 'responding' });
                    break;
                
                case 'campaign':
                    const newCampaign = await this.createCampaign(prompt);
                    addCreatedItem(newCampaign, 'campaign');
                    logCallback({ type: 'agent', message: `Successfully created new campaign: "${newCampaign.title}".`, data: newCampaign, action: 'responding' });
                    break;

                case 'storyNode':
                    if (!context?.campaign) throw new Error("A target campaign must be selected to create a story node.");
                    const updatedCampaign = await this.addStoryNodeToCampaign(prompt, context.campaign);
                    updateCampaign(updatedCampaign); // Update context
                    logCallback({ type: 'agent', message: `Added new node to campaign "${updatedCampaign.title}".`, data: updatedCampaign.nodes[updatedCampaign.nodes.length - 1], action: 'responding' });
                    break;

                case 'episode':
                    const newEpisode = await this.createEpisode(prompt, themes, agentLessons, logCallback);
                    addCreatedItem(newEpisode, 'episode');
                    logCallback({ type: 'agent', message: `Episode "${newEpisode.title}" is now available.`, action: 'responding' });
                    break;
                
                case 'strategy':
                    const newStrategy = await this.createSimpleAsset<Strategy>('strategy', prompt, themes, agentLessons, logCallback);
                    addCreatedItem(newStrategy, 'strategy');
                    logCallback({ type: 'agent', message: `Strategy "${newStrategy.name}" has been added to the playbook.`, action: 'responding' });
                    break;

                case 'item':
                    const newItem = await this.createSimpleAsset<Item>('item', prompt, themes, agentLessons, logCallback);
                    addCreatedItem(newItem, 'item');
                    logCallback({ type: 'agent', message: `Item "${newItem.name}" is now available in the market.`, action: 'responding' });
                    break;

                case 'drill':
                    const newDrill = await this.createSimpleAsset<Drill>('drill', prompt, themes, agentLessons, logCallback);
                    addCreatedItem(newDrill, 'drill');
                    logCallback({ type: 'agent', message: `Drill "${newDrill.name}" is now available in the dojo.`, action: 'responding' });
                    break;
                
                case 'visualAsset':
                    const imagePrompt = `A high-quality, vibrant digital art image for a trading game. The style is neon-cyberpunk, graphic novel aesthetic. Scene: ${prompt}`;
                    const newAsset = await this.createVisualAsset(prompt, imagePrompt, 'background', logCallback);
                    addCreatedItem(newAsset, 'visualAsset');
                    logCallback({ type: 'agent', message: `Visual asset "${newAsset.name}" has been added to the library.`, action: 'responding' });
                    break;

                default:
                    throw new Error(`Creation type "${creationType}" is not implemented.`);
            }
        } catch (error) {
            console.error(`Error handling prompt for ${creationType}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while processing your request.';
            logCallback({ type: 'error', message: `Failed to create ${creationType}. Reason: ${errorMessage}` });
        }
    }
}

// Simple UUID v4 generator to avoid adding dependencies.
const v4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


export const agentOrchestrator = new AgentOrchestrator();