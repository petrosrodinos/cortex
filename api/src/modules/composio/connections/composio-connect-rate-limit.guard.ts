import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

@Injectable()
export class ComposioConnectRateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, { count: number; resetAt: number }>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = [
      request.user?.uuid ?? request.ip ?? 'anonymous',
      request.params?.organization_uuid ?? 'no-org',
      request.params?.connected_account_id ?? request.body?.toolkit_slug ?? 'connect',
    ].join(':');
    const now = Date.now();
    const current = this.buckets.get(key);

    if (!current || current.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }

    if (current.count >= MAX_REQUESTS) {
      throw new HttpException(
        'Too many Composio connect requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    return true;
  }
}
