import { SupportedLanguage } from '@/types';
import { CodeExecutor } from './base';
import { PythonExecutor } from './python';
import { TypeScriptExecutor } from './typescript';
import { CSharpExecutor } from './csharp';
import { GoExecutor } from './go';

export function getExecutor(language: SupportedLanguage): CodeExecutor {
  switch (language) {
    case 'python':
      return new PythonExecutor();
    case 'typescript':
      return new TypeScriptExecutor();
    case 'csharp':
      return new CSharpExecutor();
    case 'go':
      return new GoExecutor();
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
