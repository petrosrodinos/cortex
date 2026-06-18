import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { SendgridModule } from '@/integrations/notifications/sendgrid/sendgrid.module';
import { ResendModule } from '@/integrations/notifications/resend/resend.module';
import { CreateJwtServiceModule } from '@/shared/utils/jwt/jwt.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MemberInvitationMailService } from './services/member-invitation-mail.service';

@Module({
  imports: [PrismaModule, OrganizationsModule, SendgridModule, ResendModule, CreateJwtServiceModule, ConfigModule],
  controllers: [MembersController],
  providers: [MembersService, MemberInvitationMailService],
})
export class MembersModule {}
