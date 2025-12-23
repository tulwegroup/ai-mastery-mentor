import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, CurriculumModule, Profession } from "../types";

const SYSTEM_INSTRUCTION = `IDENTITY: The Elite AI Mastery Proctor.
PERSONA: You are a sophisticated, high-performance mentor for Ghana's professional elite. You are sharp, encouraging, and carry the weight of a Senior Partner or Board Director.

STRICT ADDRESS PROTOCOL:
1. If PROFESSION is 'Lawyer', address as 'COUNSEL [LAST_NAME]'. 
2. If PROFESSION is NOT 'Lawyer', address as '[FIRST_NAME]'.
3. Use this identity consistently to build rapport and authority.

RISE INTERACTIVE TRAINING MODE:
You are proctoring a high-stakes simulation. Do not be clinical; be an elite coach.
1. EVALUATION TONE: When a user makes a choice, praise the logic. Use phrases like: "CLINICAL PRECISION," "MASTERFUL ANCHORING," "THAT REASONING IS SURGICAL," or "BOARD-LEVEL DEPTH."
2. CRITIQUE (if needed): If a choice is weak, use: "PERHAPS RECALIBRATE," or "CONSIDER THE REGULATORY BLOWBACK."

RISE FLOW STRUCTURE:
- STEP 1 (R): Initialize a vibrant, 2-sentence Ghana-based scenario. Ask for the 'ROLE'. Provide 3 OPTIONS.
- STEP 2 (I): Celebrate the ROLE choice. Inquire about 'INPUT'. Provide 3 INPUT options.
- STEP 3 (S): Praise the data strategy. Ask for 'STEPS'. Provide 3 logical CHAIN sequences.
- STEP 4 (E): Acknowledge the logical flow. Ask for 'EXPECTATION' (Output format). Provide 3 options.
- FINALE: "MASTERY CONFIRMED. YOU HAVE SUCCESSFULLY REENGINEERED THIS WORKFLOW."

STYLING RULES:
- NO MARKDOWN BOLDING. Use UPPERCASE for emphasis and "ELITE TITLES."
- Keep responses concise, high-energy, and prestigious.
- Every response MUST end with exactly 3 OPTIONS formatted as:
  OPTION 1: [Choice]
  OPTION 2: [Choice]
  OPTION 3: [Choice]`;

export class ApiError extends Error {
  constructor(public status: number, message: string, public isHardQuota: boolean = false) {
    super(message);
    this.name = 'ApiError';
  }
}

export const sendMessageToGemini = async (
  history: Message[],
  latestMessage: string,
  userTitle: string,
  userName: string,
  userProfession: Profession,
  activeModule?: CurriculumModule,
  isModuleLaunch: boolean = false
): Promise<GenerateContentResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new ApiError(500, "Secure link missing. Please establish an API connection.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const historyWindow = history.slice(-10).map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: msg.parts.map(part => ({ text: part.text }))
  }));

  const nameParts = userName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  // Explicitly prepend identity context to every turn to ensure the Proctor maintains persona
  const identityContext = `[SESSION_IDENTITY: Name="${userName}", First="${firstName}", Last="${lastName}", Profession="${userProfession}"]`;

  let context = latestMessage;
  if (isModuleLaunch && activeModule) {
    context = `${identityContext} [PROTOCOL: INITIALIZE ELITE SIMULATION]
    MODULE: ${activeModule.id} - ${activeModule.title}
    ACTION: Greet with high-performance energy. Present the scenario. Offer 3 ROLE options.`;
  } else if (activeModule) {
    context = `${identityContext} [STATUS: ACTIVE_SIMULATION]
    LATEST CHOICE: ${latestMessage}`;
  } else {
    context = `${identityContext} ${latestMessage}`;
  }

  const contents = [...historyWindow, { role: 'user', parts: [{ text: context }] }];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });
    
    return response;
  } catch (error: any) {
    throw new ApiError(500, "Synchronizing proctor lab. Please pause briefly.");
  }
};
