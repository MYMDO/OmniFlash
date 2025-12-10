import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChipConfig = async (chipName: string, protocol: string): Promise<string> => {
  if (!apiKey) return "// API Key missing. Cannot generate config.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a configuration script (JSON format) for a hardware programmer to interface with the ${chipName} using ${protocol}. 
      Include clock speed, voltage, endianness, and specific register initialization if needed. 
      Only return the JSON code block.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "// Error generating configuration.";
  }
};

export const analyzeHexDump = async (hexData: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this partial hex dump header and suggest what kind of file or firmware it might be. 
            Data (first 64 bytes hex): ${hexData}
            Keep it brief (under 50 words).`
        });
        return response.text;
    } catch (error) {
        return "Analysis failed.";
    }
}

export const askAssistant = async (prompt: string, context: string): Promise<string> => {
  if (!apiKey) return "Please configure your API Key to use the AI Assistant.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: User is using a Universal Hardware Programmer. Current Device Context: ${context}.
      
      User Query: ${prompt}
      
      Provide a helpful, technical response suitable for an embedded systems engineer.`,
    });
    return response.text;
  } catch (error) {
    console.error(error);
    return "I encountered an error processing your request.";
  }
};