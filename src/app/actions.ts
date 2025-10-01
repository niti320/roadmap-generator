"use server";

import { generateRoadmapFromPrompt } from "@/ai/flows/generate-roadmap-from-prompt";
import type { RoadmapStep } from "@/lib/types";

const generateId = () => `step_${Math.random().toString(36).substring(2, 11)}`;

function addIdsToSteps(steps: any[]): RoadmapStep[] {
  return steps.map((step) => ({
    id: generateId(),
    title: step.title || "Untitled Step",
    description: step.description || "No description provided.",
    subSteps: step.subSteps ? addIdsToSteps(step.subSteps) : [],
  }));
}

export async function generateRoadmapAction(
  prompt: string
): Promise<{ roadmap: RoadmapStep[] } | { error: string }> {
  if (!prompt || prompt.trim().length < 10) {
    return { error: "Please provide a more detailed prompt (at least 10 characters)." };
  }

  try {
    const result = await generateRoadmapFromPrompt({ prompt });
    if (!result.roadmap) {
      throw new Error("AI returned an empty roadmap.");
    }
    
    const parsedRoadmap = JSON.parse(result.roadmap);

    if (!Array.isArray(parsedRoadmap)) {
      throw new Error("AI did not return a valid array structure.");
    }
    
    const roadmapWithIds = addIdsToSteps(parsedRoadmap);

    return { roadmap: roadmapWithIds };
  } catch (e) {
    console.error("Roadmap Generation Error:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { error: `Failed to generate roadmap. The AI may have returned an invalid format or an error occurred. Details: ${errorMessage}` };
  }
}
