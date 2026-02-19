
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { UserPreferences, TripItinerary, TripStatus } from "../types";
import { optimizeTransport } from "./logisticsService";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (prefs: UserPreferences): Promise<TripItinerary> => {
  const ai = getAI();
  const logistics = optimizeTransport(prefs);

  const prompt = `You are the Voyager.ai Orchestration Engine. 
  Create a comprehensive travel itinerary for a ${prefs.duration}-day trip to ${prefs.destination}.
  CONTEXT: Postcode ${prefs.postcode}, ${prefs.companion} trip, ${prefs.mood} mood, ${prefs.budget} budget.
  REQUIREMENTS: Valid JSON matching schema. Use real locations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const parsed = JSON.parse(response.text);
    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      status: TripStatus.GENERATED,
      doorToDoor: {
        outbound: logistics.outbound,
        inbound: logistics.inbound,
        totalCost: "$$$",
        totalTime: "12h"
      }
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

/**
 * Complex Query Support with Thinking Mode
 */
export const askAssistantComplex = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

/**
 * Local Search with Google Maps Grounding
 */
export const searchPlaces = async (query: string, lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });
  return {
    text: response.text,
    citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

/**
 * Image Analysis for Travel Documents/Photos
 */
export const analyzeImage = async (base64Data: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: "Analyze this travel-related image. If it's a ticket, extract details. If it's a landmark, provide history and tips." }
      ]
    }
  });
  return response.text;
};

/**
 * Audio Transcription
 */
export const transcribeAudio = async (base64Audio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/wav' } },
        { text: "Transcribe the following audio exactly." }
      ]
    }
  });
  return response.text;
};

/**
 * Live Search Grounding for News/Current Events
 */
export const searchWeb = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text,
    citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

/**
 * TTS (Text to Speech)
 */
export const generateBriefingAudio = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Concierge voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};
