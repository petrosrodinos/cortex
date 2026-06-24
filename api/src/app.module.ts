import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './modules/internal/mail/mail.module';
import { SmsModule } from './modules/internal/sms/sms.module';
import { AiModule as InternalAiModule } from './modules/internal/ai/ai.module';
import { AiModule as AgentAiModule } from './shared/services/ai/ai.module';
import { RedisModule } from './core/databases/redis/redis.module';
import { RedisCacheModule } from './modules/internal/redis-cache/redis-cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/env/env.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MembersModule } from './modules/members/members.module';
import { RolesModule } from './modules/roles/roles.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { AiProvidersModule } from './modules/ai-providers/ai-providers.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { WebsocketsModule } from './core/websockets/websockets.module';
import { QueuesModule } from './core/queues/queues.module';
import { AgentQueueModule } from './core/queues/agent-queue.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationPersonalizationModule } from './modules/conversation-personalization/conversation-personalization.module';
import { ComposioModule } from './modules/composio/composio.module';
import { AgentsModule } from './modules/agents/agents.module';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    SmsModule,
    InternalAiModule,
    RedisModule,
    RedisCacheModule,
    // GraphQLModule,
    AuthModule,
    OrganizationsModule,
    MembersModule,
    RolesModule,
    IntegrationsModule,
    AiProvidersModule,
    ConversationsModule,
    AgentAiModule,
    WebsocketsModule,
    QueuesModule,
    AgentQueueModule,
    DocumentsModule,
    UsersModule,
    ConversationPersonalizationModule,
    ComposioModule,
    AgentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
