import { Logger, Module } from '@nestjs/common';
import { EmailAuthService } from './services/email.service';
import { EmailAuthController } from './controllers/email.controller';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { CreateJwtServiceModule } from '@/shared/utils/jwt/jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SendgridModule } from '@/integrations/notifications/sendgrid/sendgrid.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';

@Module({
  imports: [
    PrismaModule,
    CreateJwtServiceModule,
    SendgridModule,
    OrganizationsModule,
  ],
  providers: [EmailAuthService, JwtStrategy, Logger],
  controllers: [EmailAuthController, AuthController],
})
export class AuthModule { }
