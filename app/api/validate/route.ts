import { NextRequest } from 'next/server';
import { getExecutor } from '@/lib/executors';
import { validateCodeWithAI } from '@/lib/ai/validator-agent';
import { ValidateRequest, ValidationResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { language, code }: ValidateRequest = await req.json();

    if (!language || !code) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const executor = getExecutor(language);

    // Step 1: Syntax validation
    const syntaxResult = await executor.validateSyntax(code);

    // Step 2: Code execution (if syntax is valid)
    let executionResult;
    if (syntaxResult.valid) {
      try {
        executionResult = await executor.execute(code);
      } catch (error: any) {
        executionResult = {
          success: false,
          stdout: '',
          stderr: error.message || 'Execution failed',
          exitCode: 1,
          error: error.message,
        };
      }
    }

    // Step 3: AI validation
    const aiValidation = await validateCodeWithAI(code, language);

    const response: ValidationResponse = {
      syntaxValid: syntaxResult.valid,
      syntaxErrors: syntaxResult.errors.map((err, idx) => ({
        line: idx + 1,
        message: err,
      })),
      executionResult,
      aiValidation,
    };

    return Response.json(response);
  } catch (error: any) {
    console.error('Validation error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
