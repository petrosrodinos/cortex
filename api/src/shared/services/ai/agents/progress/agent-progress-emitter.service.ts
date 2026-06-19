import { Injectable } from '@nestjs/common';
import { WsEventsService } from '@/core/websockets/ws-events.service';
import { AgentProgressScope } from './agent-progress-scope';

@Injectable()
export class AgentProgressEmitterService {
  constructor(private readonly wsEvents: WsEventsService) {}

  createScope(
    organizationUuid: string,
    conversationUuid: string,
    executionUuid: string,
  ): AgentProgressScope {
    return new AgentProgressScope(this.wsEvents, organizationUuid, conversationUuid, executionUuid);
  }
}
