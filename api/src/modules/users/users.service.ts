import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(user_uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: user_uuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user);
  }

  async updateMe(user_uuid: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: user_uuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });

      if (existing) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    const updated = await this.prisma.user.update({
      where: { uuid: user_uuid },
      data: {
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone || null } : {}),
      },
    });

    return this.toPublicUser(updated);
  }

  async updatePassword(user_uuid: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: user_uuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('Password is not set for this account');
    }

    const password_match = await bcrypt.compare(dto.current_password, user.password);

    if (!password_match) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashed_password = await bcrypt.hash(dto.new_password, 10);

    await this.prisma.user.update({
      where: { uuid: user_uuid },
      data: { password: hashed_password },
    });

    return { message: 'Password updated successfully' };
  }

  private toPublicUser(user: {
    uuid: string;
    email: string;
    phone: string | null;
    role: string;
    created_at: Date;
    updated_at: Date;
  }) {
    return {
      uuid: user.uuid,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
