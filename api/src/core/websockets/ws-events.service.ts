import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WsEventsService {
  constructor(private readonly gateway: WebsocketGateway) {}

  executionRoom(organizationUuid: string, executionUuid: string) {
    return `org:${organizationUuid}:execution:${executionUuid}`;
  }

  conversationRoom(organizationUuid: string, conversationUuid: string) {
    return `org:${organizationUuid}:conversation:${conversationUuid}`;
  }

  emitToRoom(room: string, event: string, data: unknown) {
    this.gateway.server.to(room).emit(event, data);
  }

  emitToConversation(organizationUuid: string, conversationUuid: string, event: string, data: unknown) {
    this.emitToRoom(this.conversationRoom(organizationUuid, conversationUuid), event, data);
  }

  emitToExecution(organizationUuid: string, executionUuid: string, event: string, data: unknown) {
    this.emitToRoom(this.executionRoom(organizationUuid, executionUuid), event, data);
  }
}
