import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly users_service: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  findMe(@CurrentUser('uuid') user_uuid: string) {
    return this.users_service.findMe(user_uuid);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser('uuid') user_uuid: string, @Body() dto: UpdateUserDto) {
    return this.users_service.updateMe(user_uuid, dto);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Update current user password' })
  updatePassword(@CurrentUser('uuid') user_uuid: string, @Body() dto: UpdatePasswordDto) {
    return this.users_service.updatePassword(user_uuid, dto);
  }
}
