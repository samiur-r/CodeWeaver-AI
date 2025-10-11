'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">Describe the script you want to generate</Label>
      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'e.g., Create a script that calculates fibonacci numbers up to n...'}
        className="min-h-[120px] resize-none"
      />
    </div>
  );
}
