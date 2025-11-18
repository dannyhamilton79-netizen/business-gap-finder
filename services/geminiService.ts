import { GoogleGenAI } from "@google/genai";
import { BrandNameIdea, BusinessIdea, QuizData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const safeGenerate = async (prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
    if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
    try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error generating content:`, error);
        return `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`;
    }
}

const parseJsonResponse = (responseText: string, fallback: any) => {
    try {
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Raw response:", responseText);
        return fallback;
    }
};


export const generateBusinessPlanSection = async (sectionTitle: string, businessIdea: string): Promise<string> => {
  const prompt = `Generate a "${sectionTitle}" section for a business plan. The business idea is: "${businessIdea}". Keep it concise, professional, and well-structured.`;
  return safeGenerate(prompt);
};

export const generateBrandIdeas = async (industry: string, keywords: string, tone: string, style: string): Promise<BrandNameIdea[]> => {
    const prompt = `Generate 5 business name ideas for an enterprise in the '${industry}' industry.
    It should incorporate themes of: '${keywords}'.
    The desired tone is '${tone}' and the naming style is '${style}'.
    For each idea, provide a unique name, a catchy tagline (under 10 words), and a short one-line description.
    Return the response as a JSON array of objects, where each object has "name", "tagline", and "description" keys. Example: [{"name": "...", "tagline": "...", "description": "..."}]`;
    
    const responseText = await safeGenerate(prompt);
    return parseJsonResponse(responseText, [{ name: "Generation Error", tagline: "Please try again", description: "The AI response was not in the correct format." }]);
}

export const generateVoiceGuide = async (name: string, industry: string, traits: string[]): Promise<any> => {
    const prompt = `Create a brand voice guide for a business named '${name}' in the '${industry}' industry.
    The desired voice traits are: ${traits.join(', ')}.
    Generate a JSON object with the following keys:
    - "personality": A 3-adjective summary of the brand personality.
    - "tone": An object with "do" and "dont" keys, each containing a string array of tone guidelines.
    - "pitch": A compelling elevator pitch (under 50 words).
    - "bio": A short website bio (around 100 words).
    - "taglineAlt": An array of 3 alternative taglines.
    Example: {"personality": "...", "tone": {"do": ["..."], "dont": ["..."]}, ...}`;
    
    const responseText = await safeGenerate(prompt);
    return parseJsonResponse(responseText, { personality: 'Error', pitch: 'Could not generate voice guide.' });
}

export const generateSocialPosts = async (name: string, voice: any, goal: string, platform: string): Promise<any[]> => {
    const prompt = `Generate 5 social media post ideas for a new business named '${name}'.
    The brand voice is: ${voice.personality || 'friendly and professional'}.
    The current goal is '${goal}' for the platform '${platform}'.
    For each post, provide a JSON object with:
    - "caption": The post text.
    - "visualConcept": A brief description of a suitable image or video.
    - "hashtags": An array of 5-7 relevant hashtags.
    Return the response as a JSON array of these objects.`;

    const responseText = await safeGenerate(prompt);
    const parsed = parseJsonResponse(responseText, [{ id: 1, caption: 'Error generating posts. Please try again.', visualConcept: 'Error', hashtags: [] }]);
    return Array.isArray(parsed) ? parsed.map((post: any, index: number) => ({ ...post, id: Date.now() + index })) : [];
}

export const generatePersonaSummary = async (personaInputs: any, brandVoice?: string): Promise<any> => {
    const prompt = `Based on the following customer persona details, generate a summary and key insights.
    Inputs:
    - Goals: ${personaInputs.goals}
    - Challenges: ${personaInputs.challenges}
    - Interests: ${personaInputs.interests}
    - Motivation: ${personaInputs.motivation}
    The brand voice is '${brandVoice || 'helpful and professional'}'.
    Return a JSON object with two keys:
    - "summary": A concise, descriptive paragraph summarizing this persona.
    - "insights": An object with four keys: "online_hangouts", "key_objections", "resonating_content", "best_channel". Each value should be a short, actionable insight.
    Example: {"summary": "...", "insights": {"online_hangouts": "...", ...}}`;
    
    const responseText = await safeGenerate(prompt);
    return parseJsonResponse(responseText, { summary: 'Error generating summary.', insights: {} });
};

export const generateMarketingPlan = async (planInputs: any, brandVoice?: string): Promise<any[]> => {
    const prompt = `Create a sample 3-month marketing plan for a business with the following goal: "${planInputs.goal}".
    The focus is on '${planInputs.focus}' using these channels: ${planInputs.channels.join(', ')}.
    The brand voice is '${brandVoice || 'engaging'}'.
    Return a JSON array of 3 objects, one for each month. Each object should have keys: "month", "focus", "activities", "outcome", "notes".
    Example: [{"month": 1, "focus": "...", "activities": "...", "outcome": "...", "notes": "..."}]`;

    const responseText = await safeGenerate(prompt);
    const parsed = parseJsonResponse(responseText, []);
    return Array.isArray(parsed) ? parsed.map((item: any) => ({ ...item, id: Date.now() + Math.random() })) : [];
};

export const generateNicheSuggestions = async (industry: string, location: string): Promise<string[]> => {
    const prompt = `For a business in the "${industry}" industry in "${location}", generate a list of 5 unique selling propositions (USPs) or niche specializations that would help it stand out from competitors. Focus on actionable and creative ideas.
    Return the response as a JSON array of strings.
    Example: ["Focus on eco-friendly, subscription-based services", "Partner with local apartment complexes for exclusive deals", "Offer a 'silent' service for work-from-home clients"]`;
    
    const responseText = await safeGenerate(prompt);
    return parseJsonResponse(responseText, ["Error: Could not generate suggestions."]);
};

export const generateBusinessIdeas = async (criteria: Partial<QuizData>): Promise<BusinessIdea[]> => {
    const { area, budget, sector, expertise } = criteria;
    const prompt = `Act as an expert business analyst. Generate 5 unique and viable business ideas based on the following criteria:
- **Location:** ${area || 'any major city'} (Consider local market trends, demographics, and potential gaps in this area or similar types of areas).
- **Startup Budget:** ${budget || 'any budget'}.
- **Sector of Interest:** ${sector || 'any sector'}.
${expertise ? `- **User's Expertise:** ${expertise}. Try to leverage this skill.` : ''}

For each idea, provide a detailed JSON object with the following keys:
- "id": A unique string ID.
- "name": A catchy and descriptive business name.
- "shortDescription": A one-sentence summary.
- "longDescription": A 2-paragraph detailed description of the business model and value proposition.
- "industry": The specific industry (e.g., "Food & Beverage", "Tech Consulting").
- "targetMarket": Who the primary customers are.
- "startupCostEstimated": A string representing the estimated startup cost range (e.g., "$1k - $5k").
- "roiPotential": "High", "Medium", or "Low".
- "difficulty": "Easy", "Medium", or "Hard".
- "revenueModel": How the business makes money (e.g., "Direct Sales", "Subscription").

Return ONLY a valid JSON array of these 5 objects.`;

    const responseText = await safeGenerate(prompt);
    return parseJsonResponse(responseText, []);
};