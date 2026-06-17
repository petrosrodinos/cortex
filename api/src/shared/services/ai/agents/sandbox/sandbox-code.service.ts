import { Injectable, Logger } from '@nestjs/common';
import type { SandboxSessionLike } from '@openai/agents/sandbox';

interface ExecutionSandboxState {
  session: SandboxSessionLike;
}

@Injectable()
export class SandboxCodeService {
  private readonly logger = new Logger(SandboxCodeService.name);
  private readonly sessions = new Map<string, ExecutionSandboxState>();

  async ensureSession(executionUuid: string): Promise<SandboxSessionLike | null> {
    const existing = this.sessions.get(executionUuid);
    if (existing) {
      return existing.session;
    }

    try {
      const localModule = await import('@openai/agents/sandbox/local');
      const { Manifest } = await import('@openai/agents/sandbox');
      const UnixLocalSandboxClient = localModule.UnixLocalSandboxClient;

      if (!UnixLocalSandboxClient) {
        return null;
      }

      const client = new UnixLocalSandboxClient();
      const session = await client.create({ manifest: new Manifest({ entries: {} }) });
      this.sessions.set(executionUuid, { session });
      return session;
    } catch (error) {
      this.logger.warn(
        `Sandbox unavailable: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
      return null;
    }
  }

  async runPython(
    executionUuid: string,
    code: string,
  ): Promise<{ stdout: string; stderr: string; files: string[]; exitCode: number | null; note?: string }> {
    const session = await this.ensureSession(executionUuid);

    if (!session?.exec || !session.materializeEntry) {
      return {
        stdout: '',
        stderr: 'Code interpreter sandbox is not available in this environment.',
        files: [],
        exitCode: null,
        note: 'Configure @openai/agents sandbox to enable Python execution.',
      };
    }

    try {
      const { file } = await import('@openai/agents/sandbox');
      const scriptPath = '_agent_script.py';

      await session.materializeEntry({
        path: scriptPath,
        entry: file({ content: code }),
      });

      const result = await session.exec({
        cmd: `python3 ${scriptPath}`,
        workdir: '/workspace',
      });

      return {
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        files: [],
        exitCode: result.exitCode ?? null,
      };
    } catch (error) {
      return {
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Sandbox execution failed',
        files: [],
        exitCode: 1,
      };
    }
  }

  async closeSession(executionUuid: string): Promise<void> {
    const state = this.sessions.get(executionUuid);
    if (!state) {
      return;
    }

    try {
      if (state.session.close) {
        await state.session.close();
      } else if (state.session.shutdown) {
        await state.session.shutdown();
      }
    } catch (error) {
      this.logger.warn(
        `Failed to close sandbox session for execution ${executionUuid}: ${error instanceof Error ? error.message : error}`,
      );
    } finally {
      this.sessions.delete(executionUuid);
    }
  }
}
