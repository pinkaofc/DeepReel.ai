
// Fix: Import Modality for use in speech generation config.
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Language, VoiceTone, ReelResult } from '../types';
import { decode, pcmToWavBlob } from '../utils/audio';
import { getApiKey } from './apiKeyStore';

const generateCreativeAssets = async (ai: GoogleGenAI, script: string, tone: VoiceTone): Promise<{ videoPrompt: string; musicDescription: string; subtitles: string }> => {
    const prompt = `You are an expert creative director for short-form video content. Analyze the following script and its emotional tone to generate a complete creative package.

**Script:** "${script}"
**Emotional Tone:** ${tone}

Perform the following tasks and return the result as a single JSON object:

1.  **videoPrompt**: Generate a highly detailed, scene-by-scene prompt for a text-to-video AI model (like Veo). The goal is a visually stunning, 9:16 vertical video that is metaphorical and abstract, not literal. Describe camera movements, lighting, color palettes, and an attention-grabbing visual hook. This should be a single, concise paragraph.

2.  **musicDescription**: Write a 1-2 sentence description of an ideal, original, royalty-free background music track. Describe the genre, instruments, tempo, and how it should adapt to the script's emotional beats.

3.  **subtitles**: Generate a single string of subtitles for the script. Break the script into short, readable lines using newline characters (\\n) for maximum engagement on platforms like Instagram Reels.

Respond with a valid JSON object matching the schema. Do not include any other text or markdown formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    videoPrompt: { type: Type.STRING },
                    musicDescription: { type: Type.STRING },
                    subtitles: { type: Type.STRING }
                },
                required: ['videoPrompt', 'musicDescription', 'subtitles']
            },
        },
    });
    
    return JSON.parse(response.text);
};


const generateVideo = async (ai: GoogleGenAI, videoPrompt: string, onProgress: (message: string) => void): Promise<string> => {
    onProgress("Generating video... This process can take several minutes. Please wait.");
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p', 
            aspectRatio: '9:16'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
        throw new Error("Video generation failed or returned no URI.");
    }
    
    const downloadLink = operation.response.generatedVideos[0].video.uri;
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API key not found for video download.");

    const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

const generateVoiceOver = async (ai: GoogleGenAI, script: string, language: Language, tone: VoiceTone): Promise<string> => {
    const toneMap: Record<VoiceTone, string> = {
        Motivational: "inspirationally and with conviction",
        Calm: "calmly and soothingly",
        Storyteller: "in a deep, engaging storyteller voice",
        Deep: "in a deep, resonant voice",
        Friendly: "in a friendly and warm tone",
    };
    
    const ttsPrompt = `Say ${toneMap[tone]}: ${script}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: ttsPrompt }] }],
        config: {
            // Fix: Use Modality.AUDIO enum instead of a string literal to align with SDK guidelines.
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: language === 'hindi' ? 'Puck' : 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Failed to generate voice-over audio.");
    }

    const pcmData = decode(base64Audio);
    const audioBlob = pcmToWavBlob(pcmData, { sampleRate: 24000, numChannels: 1 });
    return URL.createObjectURL(audioBlob);
};

export const generateReel = async (
    script: string,
    language: Language,
    voiceTone: VoiceTone,
    onProgress: (message: string) => void,
    onComplete: (result: ReelResult) => void,
    onError: (error: string) => void
) => {
    try {
        onProgress("Checking API Key...");
        const apiKey = getApiKey();
        
        if (!apiKey) {
             throw new Error("API key not available. Please select or provide an API key to proceed.");
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        onProgress("Analyzing script and generating creative assets...");
        const creativeAssetsPromise = generateCreativeAssets(ai, script, voiceTone);
        
        onProgress("Crafting voice-over...");
        const voiceOverPromise = generateVoiceOver(ai, script, language, voiceTone);
        
        const [creativeAssets, audioUrl] = await Promise.all([creativeAssetsPromise, voiceOverPromise]);

        const { videoPrompt, musicDescription, subtitles } = creativeAssets;

        onProgress("Generated creative concept. Now generating video...");
        const videoUrl = await generateVideo(ai, videoPrompt, onProgress);
        
        onProgress("Assembling your DeepReel...");
        
        onComplete({
            videoUrl,
            audioUrl,
            musicDescription,
            subtitles
        });

    } catch (e) {
        const error = e as Error;
        console.error("Reel generation failed:", error);
        onError(error.message || 'An unknown error occurred during generation.');
    }
};
