'use client';

import { useState, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { LanguageSelector } from '@/components/LanguageSelector';
import { PromptInput } from '@/components/PromptInput';
import { ScriptDisplay } from '@/components/ScriptDisplay';
import { ValidationPanel } from '@/components/ValidationPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SupportedLanguage, ValidationResponse } from '@/types';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [prompt, setPrompt] = useState('');
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: async (url, options) => {
        // Add language to the request body
        const body = options?.body ? JSON.parse(options.body as string) : {};
        body.language = language;

        return fetch(url, {
          ...options,
          body: JSON.stringify(body),
        });
      },
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Extract the generated code from the last assistant message
  const generatedCode = useMemo(() => {
    const lastMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastMessage) return '';

    const textContent = lastMessage.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');

    return textContent;
  }, [messages]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setValidation(null);

    sendMessage({
      text: prompt,
    });
  };

  const handleValidate = async () => {
    if (!generatedCode) return;

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code: generatedCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data: ValidationResponse = await response.json();
      setValidation(data);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CodeWeaver AI
          </h1>
          <p className="text-muted-foreground">
            Generate, validate, and execute code in multiple programming languages
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Script</CardTitle>
                <CardDescription>
                  Select a programming language and describe what you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <LanguageSelector value={language} onChange={setLanguage} />
                </div>

                <PromptInput value={prompt} onChange={setPrompt} />

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Quick Examples:</label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt("Create a function to calculate fibonacci numbers up to n with memoization")}
                      disabled={isLoading}
                    >
                      Fibonacci Calculator
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt("Create a REST API endpoint that fetches user data and handles errors gracefully")}
                      disabled={isLoading}
                    >
                      REST API Endpoint
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Script'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Validation Section */}
            {generatedCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Validate & Execute</CardTitle>
                  <CardDescription>
                    Check syntax, run the code, and get AI-powered analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleValidate}
                    disabled={!generatedCode || isValidating}
                    className="w-full"
                    variant="secondary"
                    size="lg"
                  >
                    {isValidating ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Validate & Execute Code'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Output Section */}
          <div className="space-y-6">
            {/* Generated Code Display */}
            <ScriptDisplay code={generatedCode} language={language} />

            {/* Validation Results */}
            {(validation || isValidating) && (
              <ValidationPanel validation={validation} isLoading={isValidating} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
