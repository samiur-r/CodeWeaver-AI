export type SupportedLanguage =
  | 'python'
  | 'typescript'
  | 'csharp'
  | 'java'
  | 'go'
  | 'rust'
  | 'php';

export interface GenerateRequest {
  language: SupportedLanguage;
  prompt: string;
}

export interface ValidateRequest {
  language: SupportedLanguage;
  code: string;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

export interface SyntaxError {
  line: number;
  column?: number;
  message: string;
}

export interface AIValidationResult {
  issues: string[];
  suggestions: string[];
  securityConcerns: string[];
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  explanation?: string;
}

export interface ValidationResponse {
  syntaxValid: boolean;
  syntaxErrors: SyntaxError[];
  executionResult?: ExecutionResult;
  aiValidation?: AIValidationResult;
}

export interface LanguageConfig {
  name: string;
  value: SupportedLanguage;
  extension: string;
  mimeType: string;
}
