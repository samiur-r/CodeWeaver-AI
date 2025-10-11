import { LanguageConfig, SupportedLanguage } from '@/types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    name: 'Python',
    value: 'python',
    extension: 'py',
    mimeType: 'text/x-python',
  },
  {
    name: 'TypeScript',
    value: 'typescript',
    extension: 'ts',
    mimeType: 'text/typescript',
  },
  {
    name: 'C#',
    value: 'csharp',
    extension: 'cs',
    mimeType: 'text/x-csharp',
  },
  {
    name: 'Go',
    value: 'go',
    extension: 'go',
    mimeType: 'text/x-go',
  },
];

export const getLanguageConfig = (language: SupportedLanguage): LanguageConfig => {
  return SUPPORTED_LANGUAGES.find((l) => l.value === language) || SUPPORTED_LANGUAGES[0];
};
