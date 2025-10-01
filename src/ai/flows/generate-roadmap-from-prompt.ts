'use server';
/**
 * @fileOverview Generates a roadmap based on a user-provided prompt.
 *
 * - generateRoadmapFromPrompt - A function that takes a prompt and returns a roadmap.
 * - GenerateRoadmapFromPromptInput - The input type for the generateRoadmapFromPrompt function.
 * - GenerateRoadmapFromPromptOutput - The return type for the generateRoadmapFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoadmapFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the desired roadmap.'),
});
export type GenerateRoadmapFromPromptInput = z.infer<typeof GenerateRoadmapFromPromptInputSchema>;

const GenerateRoadmapFromPromptOutputSchema = z.object({
  roadmap: z
    .string()
    .describe('A roadmap as a JSON array of steps based on the prompt.'),
});
export type GenerateRoadmapFromPromptOutput = z.infer<typeof GenerateRoadmapFromPromptOutputSchema>;

export async function generateRoadmapFromPrompt(
  input: GenerateRoadmapFromPromptInput
): Promise<GenerateRoadmapFromPromptOutput> {
  return generateRoadmapFromPromptFlow(input);
}

const roadmapPrompt = ai.definePrompt({
  name: 'roadmapPrompt',
  input: {schema: GenerateRoadmapFromPromptInputSchema},
  output: {schema: GenerateRoadmapFromPromptOutputSchema},
  prompt: `You are an expert roadmap generator. Based on the user's prompt, you will generate a roadmap with suggested steps to achieve it.

  The roadmap should be returned as a JSON array of steps. Each step must be an object with 'title', 'description', and 'subSteps' properties. 'subSteps' should be an array of step objects, which can be empty.
  For example:
  [
    {
      "title": "Phase 1: Foundation",
      "description": "Lay the groundwork for the project.",
      "subSteps": [
        {
          "title": "Sub-step 1.1",
          "description": "Details for sub-step 1.1",
          "subSteps": []
        }
      ]
    },
    {
      "title": "Phase 2: Development",
      "description": "Build the core features.",
      "subSteps": []
    }
  ]

  User Prompt: {{{prompt}}}`,
});

const generateRoadmapFromPromptFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFromPromptFlow',
    inputSchema: GenerateRoadmapFromPromptInputSchema,
    outputSchema: GenerateRoadmapFromPromptOutputSchema,
  },
  async input => {
    const {output} = await roadmapPrompt(input);
    return output!;
  }
);
