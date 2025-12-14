import { GoogleGenAI, Type } from "@google/genai";
import { PresentationData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePresentationContent = async (userNotes: string): Promise<PresentationData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert presentation designer and public speaking coach. 
      Create a structured presentation based on the user's rough notes.
      
      User Notes:
      ${userNotes}
      
      Requirements:
      1. Create a logical flow of slides.
      2. Each slide must have a punchy title.
      3. 'points' should be concise bullet points. If the user provides specific examples (e.g., specific questions for AI, or specific coding steps), you MUST include them as distinct points.
      4. 'keyMessage' is a single, memorable sentence summarizing the slide (the "takeaway").
      5. 'speakerNotes' should be a conversational script or detailed elaboration for the presenter.
      6. The output must be in Traditional Chinese (Taiwan).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "A catchy title for the whole presentation" },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  points: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  keyMessage: { type: Type.STRING, description: "The core philosophical or practical takeaway of this slide." },
                  speakerNotes: { type: Type.STRING, description: "Detailed script for the speaker." }
                },
                required: ["title", "points", "keyMessage", "speakerNotes"]
              }
            }
          },
          required: ["topic", "slides"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as PresentationData;

  } catch (error) {
    console.error("Error generating presentation:", error);
    throw error;
  }
};