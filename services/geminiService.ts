import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { Option } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const generateMidAutumnImages = async (
  sourceImageFile: File,
  selectedPrompt: Option,
  aspectRatio: string,
  quality: string
): Promise<string[]> => {
  const reader = new FileReader();
  const fileReadPromise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:mime/type;base64," prefix
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(sourceImageFile);
  });

  const base64Data = await fileReadPromise;
  const imagePart = fileToGenerativePart(base64Data, sourceImageFile.type);
  
  let aspectRatioInstruction = '';
  switch (aspectRatio) {
    case '3:4':
      aspectRatioInstruction = 'The final image must be a vertical portrait with a 3:4 aspect ratio.';
      break;
    case '9:16':
      aspectRatioInstruction = 'The final image must be a tall, vertical portrait with a 9:16 aspect ratio.';
      break;
    case '1:1':
    default:
      aspectRatioInstruction = 'The final image must be a square with a 1:1 aspect ratio.';
      break;
  }

  const prompt = `${selectedPrompt.value}\n\nIMPORTANT INSTRUCTIONS:\n- ${aspectRatioInstruction}\n- The image quality must be: ${quality}.`;

  const generateImage = async (): Promise<string | null> => {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            imagePart,
            { text: prompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error generating image with Gemini:", error);
      return null;
    }
  };
  
  // Call the API 4 times in parallel to get 4 different images
  const imagePromises = [generateImage(), generateImage(), generateImage(), generateImage()];
  const results = await Promise.all(imagePromises);

  // Filter out any null results from failed API calls
  return results.filter((result): result is string => result !== null);
};