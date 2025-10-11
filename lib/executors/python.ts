import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { CodeExecutor, EXECUTION_TIMEOUT, MAX_OUTPUT_SIZE } from './base';
import { ExecutionResult } from '@/types';

const execAsync = promisify(exec);

export class PythonExecutor implements CodeExecutor {
  async validateSyntax(code: string): Promise<{ valid: boolean; errors: string[] }> {
    const tempFile = join(tmpdir(), `temp_${Date.now()}.py`);

    try {
      await writeFile(tempFile, code);

      const { stderr } = await execAsync(`python3 -m py_compile ${tempFile}`, {
        timeout: 5000,
      });

      await unlink(tempFile);

      if (stderr) {
        return {
          valid: false,
          errors: [stderr],
        };
      }

      return { valid: true, errors: [] };
    } catch (error: any) {
      try {
        await unlink(tempFile);
      } catch {}

      return {
        valid: false,
        errors: [error.message || 'Syntax validation failed'],
      };
    }
  }

  async execute(code: string): Promise<ExecutionResult> {
    const tempFile = join(tmpdir(), `script_${Date.now()}.py`);

    try {
      await writeFile(tempFile, code);

      const { stdout, stderr } = await execAsync(`python3 ${tempFile}`, {
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
