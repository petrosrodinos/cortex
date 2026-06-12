import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { SwitchOrganizationDto } from '../dto/switch-organization.dto';
import { EmailAuthService } from '../services/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: EmailAuthService) {}

  @Post('switch-organization')
  @UseGuards(JwtGuard)
  async switchOrganization(@CurrentUser('uuid') user_uuid: string, @Body() dto: SwitchOrganizationDto) {
    try {
      return await this.auth_service.switchOrganization(user_uuid, dto);
    } catch (error) {
      throw error;
    }
  }
}
