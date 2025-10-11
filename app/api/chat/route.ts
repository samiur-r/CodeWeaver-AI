import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { getSystemPrompt, LANGUAGE_CONTEXTS } from '@/lib/ai/prompts';
import { SupportedLanguage } from '@/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, language }: { messages: UIMessage[]; language?: SupportedLanguage } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    // Get the user's prompt from the last message
    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('');

    // Use the language from request or default to python
    const selectedLanguage: SupportedLanguage = language || 'python';
    const systemPrompt = getSystemPrompt(selectedLanguage, userPrompt);

    const result = streamText({
      model: openai('gpt-4.1-nano'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error generating script:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
