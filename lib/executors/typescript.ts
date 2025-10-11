import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { CodeExecutor, EXECUTION_TIMEOUT, MAX_OUTPUT_SIZE } from './base';
import { ExecutionResult } from '@/types';
import * as ts from 'typescript';

const execAsync = promisify(exec);

export class TypeScriptExecutor implements CodeExecutor {
  async validateSyntax(code: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          strict: true,
        },
        reportDiagnostics: true,
      });

      if (result.diagnostics && result.diagnostics.length > 0) {
        const errors = result.diagnostics.map((diagnostic) => {
          const message = ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            '\n'
          );
          return message;
        });

        return { valid: false, errors };
      }

      return { valid: true, errors: [] };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message || 'Syntax validation failed'],
      };
    }
  }

  async execute(code: string): Promise<ExecutionResult> {
    const tempFile = join(tmpdir(), `script_${Date.now()}.ts`);

    try {
      await writeFile(tempFile, code);

      // Use ts-node to execute TypeScript directly
      const { stdout, stderr } = await execAsync(`npx ts-node ${tempFile}`, {
        timeout: EXECUTION_TIMEOUT,
        maxBuffer: MAX_OUTPUT_SIZE,
      });

      await unlink(tempFile);

      return {
        success: true,
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: 0,
      };
    } catch (error: any) {
      try {
        await unlink(tempFile);
      } catch {}

      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message || '',
        exitCode: error.code || 1,
        error: error.message,
      };
    }
  }
}
