'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';
import { SupportedLanguage } from '@/types';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-11 bg-background border-2 hover:border-primary/50 transition-colors">
        <SelectValue>
          <span className="font-medium">{currentLanguage?.name || 'Select a language'}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{lang.name}</span>
              <span className="text-xs text-muted-foreground">.{lang.extension}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
