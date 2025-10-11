'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ValidationResponse } from '@/types';
import { CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ValidationPanelProps {
  validation: ValidationResponse | null;
  isLoading?: boolean;
}

export function ValidationPanel({ validation, isLoading }: ValidationPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Validating code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!validation) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Validation results will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Syntax Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {validation.syntaxValid ? (
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
            ) : (
              <CrossCircledIcon className="h-5 w-5 text-red-500" />
            )}
            Syntax Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validation.syntaxValid ? (
            <p className="text-sm text-green-600">No syntax errors found</p>
          ) : (
            <div className="space-y-2">
              {validation.syntaxErrors.map((error, idx) => (
                <div key={idx} className="text-sm text-red-600">
                  <span className="font-medium">Line {error.line}:</span> {error.message}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Results */}
      {validation.executionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validation.executionResult.success ? (
                <CheckCircledIcon className="h-5 w-5 text-green-500" />
              ) : (
                <CrossCircledIcon className="h-5 w-5 text-red-500" />
              )}
              Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Exit Code:</p>
              <Badge variant={validation.executionResult.exitCode === 0 ? 'default' : 'destructive'}>
                {validation.executionResult.exitCode}
              </Badge>
            </div>

            {validation.executionResult.stdout && (
              <div>
                <p className="text-sm font-medium mb-1">Output:</p>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {validation.executionResult.stdout}
                </pre>
              </div>
            )}

            {validation.executionResult.stderr && (
              <div>
                <p className="text-sm font-medium mb-1">Errors:</p>
                <pre className="text-xs bg-red-50 text-red-900 p-3 rounded-md overflow-x-auto">
                  {validation.executionResult.stderr}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Validation */}
      {validation.aiValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                AI Analysis
              </span>
              <Badge className={getRatingColor(validation.aiValidation.rating)}>
                {validation.aiValidation.rating.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validation.aiValidation.explanation && (
              <div>
                <p className="text-sm">{validation.aiValidation.explanation}</p>
              </div>
            )}

            {validation.aiValidation.issues.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.aiValidation.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.aiValidation.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Suggestions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.aiValidation.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm text-blue-600">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.aiValidation.securityConcerns.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Security Concerns:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validation.aiValidation.securityConcerns.map((concern, idx) => (
                    <li key={idx} className="text-sm text-orange-600">
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
