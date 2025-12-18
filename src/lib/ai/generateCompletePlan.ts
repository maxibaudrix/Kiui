import { GoogleGenerativeAI } from "@google/generative-ai";
import type { UserPlanningContext, CompletePlanningOutput } from "@/types/planning";
import { getSystemPrompt, buildUserPrompt } from "@/lib/ai/planningPrompts";
import { parsePlanningResponse } from "@/lib/ai/parsePlanningResponse";

/**
 * Genera un plan completo usando Google AI (Gemini)
 */
export async function generateCompletePlan(
  context: UserPlanningContext
): Promise<CompletePlanningOutput> {
  // Validar API key
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  // Inicializar cliente de Google AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Usar Gemini 1.5 Pro (mejor para tareas complejas)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    generationConfig: {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8000,
    },
  });

  try {
    console.log("[generateCompletePlan] Starting AI generation...");
    
    // Construir prompts
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(context);

    // Combinar prompts (Gemini no tiene system/user separado como Claude)
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Llamar a la API
    const startTime = Date.now();
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    const duration = Date.now() - startTime;

    console.log(`[generateCompletePlan] AI responded in ${duration}ms`);

    // Parsear y validar respuesta
    const planOutput = parsePlanningResponse(text);

    console.log("[generateCompletePlan] Plan generated successfully");
    console.log(`- Total weeks: ${planOutput.totalWeeks}`);
    console.log(`- Total training days: ${planOutput.overallStats.totalTrainingDays}`);

    return planOutput;

  } catch (error: any) {
    console.error("[generateCompletePlan] Error:", error);
    
    // Errores específicos de Google AI
    if (error.message?.includes("API_KEY")) {
      throw new Error("Invalid Google AI API key");
    }
    if (error.message?.includes("quota")) {
      throw new Error("Google AI API quota exceeded");
    }
    
    throw new Error(`Failed to generate plan: ${error.message}`);
  }
}