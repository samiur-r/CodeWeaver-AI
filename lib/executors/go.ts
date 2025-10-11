import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { CodeExecutor, EXECUTION_TIMEOUT, MAX_OUTPUT_SIZE } from './base';
import { ExecutionResult } from '@/types';

const execAsync = promisify(exec);

export class GoExecutor implements CodeExecutor {
  async validateSyntax(code: string): Promise<{ valid: boolean; errors: string[] }> {
    const tempFile = join(tmpdir(), `temp_${Date.now()}.go`);

    try {
      await writeFile(tempFile, code);

      // Use gofmt to check syntax
      const { stderr } = await execAsync(`gofmt -e ${tempFile}`, {
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

      // If go is not installed, skip validation
      if (error.message?.includes('gofmt: command not found')) {
        return {
          valid: true,
          errors: [],
        };
      }

      return {
        valid: false,
        errors: [error.stderr || error.message || 'Syntax validation failed'],
      };
    }
  }

  async execute(code: string): Promise<ExecutionResult> {
    const tempFile = join(tmpdir(), `main_${Date.now()}.go`);

    try {
      await writeFile(tempFile, code);

      // Execute using go run
      const { stdout, stderr } = await execAsync(`go run ${tempFile}`, {
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

      // If go is not installed, return helpful error
      if (error.message?.includes('command not found')) {
        return {
          success: false,
          stdout: '',
          stderr: 'Go execution requires Go to be installed',
          exitCode: 1,
          error: 'Go not found',
        };
      }

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
