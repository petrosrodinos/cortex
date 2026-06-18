import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsString()
  @MinLength(1)
  current_password: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  new_password: string;
}
