import { ExecutionResult } from '@/types';

export interface CodeExecutor {
  execute(code: string): Promise<ExecutionResult>;
  validateSyntax(code: string): Promise<{ valid: boolean; errors: string[] }>;
}

export const EXECUTION_TIMEOUT = parseInt(process.env.EXECUTION_TIMEOUT || '10000');
export const MAX_OUTPUT_SIZE = parseInt(process.env.MAX_OUTPUT_SIZE || '10000');
