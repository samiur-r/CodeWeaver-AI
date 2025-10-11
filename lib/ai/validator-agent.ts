import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { VALIDATION_SYSTEM_PROMPT } from './prompts';
import { AIValidationResult, SupportedLanguage } from '@/types';

const ValidationSchema = z.object({
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  securityConcerns: z.array(z.string()),
  rating: z.enum(['excellent', 'good', 'fair', 'poor']),
  explanation: z.string().optional(),
});

export async function validateCodeWithAI(
  code: string,
  language: SupportedLanguage
): Promise<AIValidationResult> {
  try {
    const prompt = `Analyze the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: ValidationSchema,
      system: VALIDATION_SYSTEM_PROMPT,
      prompt: prompt,
    });

    return object as AIValidationResult;
  } catch (error) {
    console.error('AI validation error:', error);
    return {
      issues: ['AI validation temporarily unavailable'],
      suggestions: [],
      securityConcerns: [],
      rating: 'fair',
      explanation: 'Could not complete AI validation',
    };
  }
}
