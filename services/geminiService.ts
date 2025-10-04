
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        captions: {
            type: Type.ARRAY,
            description: "3 unique, platform-tailored captions with natural emojis, each 10-25 words long.",
            items: { type: Type.STRING },
        },
        hashtags: {
            type: Type.ARRAY,
            description: "5-8 relevant hashtags for the topic.",
            items: { type: Type.STRING },
        },
    },
    required: ['captions', 'hashtags'],
};


export const generateCaptions = async (topic: string, tone: string, platform: string): Promise<GeminiResponse & { historyId: string }> => {
    try {
        const prompt = `
            System: You are Captionly AI, an expert social media copywriter. Output valid JSON only, adhering to the provided schema.
            User: Generate captions and hashtags for the following request.
            Request Details:
            - Topic: "${topic}"
            - Tone: "${tone}"
            - Platform: "${platform}"
            
            Constraints:
            - Provide exactly 3 unique captions.
            - Each caption should be between 10 and 25 words.
            - Tailor the captions for the specified platform.
            - Include natural-looking emojis.
            - Provide between 5 and 8 relevant hashtags.
            - Do not include any extra commentary, text, or markdown formatting like \`\`\`json.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
                topP: 0.95,
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (!parsedResponse.captions || !parsedResponse.hashtags) {
            throw new Error('AI response is missing captions or hashtags.');
        }

        // In a real app, this ID would come from the backend after saving to Firestore.
        const historyId = `mock_${Date.now()}`;

        return {
            ...parsedResponse,
            historyId,
        };

    } catch (error) {
        console.error("Error generating captions with Gemini:", error);
        throw new Error("Failed to generate captions. The AI model might be temporarily unavailable.");
    }
};
