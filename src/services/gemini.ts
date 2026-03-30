import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GenerationResult {
  billboard: string;
  newspaper: string;
  social: string;
  description: string;
}

export async function generateBrandImages(productDescription: string): Promise<GenerationResult> {
  // 1. Generate a detailed visual description for consistency
  const descResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a highly detailed visual description of a product based on this: "${productDescription}". 
    Focus on materials, colors, textures, branding, and shape. 
    The description should be concise but specific enough to ensure consistency in image generation. 
    DO NOT include people in the description.`,
  });

  const detailedDesc = descResponse.text || productDescription;

  // 2. Generate images for each medium
  const mediums = [
    { key: "billboard", prompt: `A high-quality billboard advertisement in a city setting featuring: ${detailedDesc}. Professional photography, clean layout, no people, daylight.` },
    { key: "newspaper", prompt: `A black and white newspaper advertisement featuring: ${detailedDesc}. Vintage texture, halftone print style, no people, classic layout.` },
    { key: "social", prompt: `A modern social media post (Instagram style) featuring: ${detailedDesc} on a minimalist background. High-end product photography, no people, soft lighting.` },
  ];

  const results: any = { description: detailedDesc };

  await Promise.all(
    mediums.map(async (m) => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: m.prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: m.key === "billboard" ? "16:9" : m.key === "social" ? "1:1" : "3:4",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          results[m.key] = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    })
  );

  return results as GenerationResult;
}
