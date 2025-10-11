import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { GenerateRequest } from '@/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { language, prompt }: GenerateRequest = await req.json();

    if (!language || !prompt) {
      return new Response('Missing required fields', { status: 400 });
    }

    const systemPrompt = getSystemPrompt(language, prompt);

    const result = streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error generating script:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
