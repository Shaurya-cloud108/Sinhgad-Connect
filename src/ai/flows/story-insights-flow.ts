'use server';
/**
 * @fileOverview An AI flow to analyze success stories and provide insights.
 *
 * - analyzeStory - A function that handles the story analysis process.
 * - StoryAnalysisInput - The input type for the analyzeStory function.
 * - StoryAnalysisOutput - The return type for the analyzeStory function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StoryAnalysisInputSchema = z.object({
  story: z.string().describe('The full text of the success story.'),
  role: z.string().describe('The person\'s role or headline.'),
  name: z.string().describe('The person\'s name.'),
});
export type StoryAnalysisInput = z.infer<typeof StoryAnalysisInputSchema>;

const StoryAnalysisOutputSchema = z.object({
  summary: z.string().describe("A concise, engaging summary of the person's journey and key achievements, written in narrative form."),
  keyTakeaways: z.array(z.string()).describe("A list of 3-4 bullet points highlighting the most important lessons or takeaways from their story."),
  careerAdvice: z.string().describe("Actionable career advice for other alumni inspired by this person's path. It should be encouraging and suggest concrete steps, skills, or mindsets."),
});
export type StoryAnalysisOutput = z.infer<typeof StoryAnalysisOutputSchema>;

export async function analyzeStory(input: StoryAnalysisInput): Promise<StoryAnalysisOutput> {
  return storyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyAnalysisPrompt',
  input: { schema: StoryAnalysisInputSchema },
  output: { schema: StoryAnalysisOutputSchema },
  prompt: `You are an expert career coach and storyteller for a prestigious college alumni network.
Your task is to analyze the success story of an alumnus and generate insightful, inspiring content for other members of the community.

Analyze the following success story for {{name}}, whose role is "{{role}}":
---
{{story}}
---

Based on the story, generate the following:
1.  **Summary**: Write a compelling summary of their career journey and accomplishments. It should be inspiring and highlight their impact.
2.  **Key Takeaways**: Identify 3-4 key lessons or actionable takeaways that other alumni can learn from this story.
3.  **Career Advice**: Provide personalized and encouraging career advice for other alumni, drawing inspiration from the subject's journey. What skills should they build? What mindsets should they adopt?

Present the output in the structured format requested.
`,
});

const storyAnalysisFlow = ai.defineFlow(
  {
    name: 'storyAnalysisFlow',
    inputSchema: StoryAnalysisInputSchema,
    outputSchema: StoryAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
