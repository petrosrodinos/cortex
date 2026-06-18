import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailAuthService } from '../services/email.service';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { RegisterInvitationDto } from '../dto/register-invitation.dto';
import { LoginEmailDto } from '../dto/login-email.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthResponse } from '../entities/auth-response.entity';
import { WaitlistDto } from '../dto/waitlist.dto';

@ApiTags('Email Authentication')
@Controller('auth/email')
export class EmailAuthController {
    constructor(private readonly authService: EmailAuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user with email and password' })
    @ApiBody({ type: RegisterEmailDto })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponse
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - User with this email already exists'
    })
    async registerWithEmail(@Body() dto: RegisterEmailDto) {
        try {
            return this.authService.registerWithEmail(dto);

        } catch (error) {
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user with email and password' })
    @ApiBody({ type: LoginEmailDto })
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        type: AuthResponse
    })
    async loginWithEmail(@Body() dto: LoginEmailDto) {
        return this.authService.loginWithEmail(dto);
    }

    @Post('/waitlist')
    @ApiOperation({ summary: 'Waitlist a user with ref code' })
    @ApiBody({ type: WaitlistDto })
    @ApiResponse({
        status: 200,
        description: 'User referred successfully',
        type: AuthResponse
    })
    async waitlist(@Body() dto: WaitlistDto) {
        return this.authService.waitlist(dto);
    }

    @Get('invitation')
    @ApiOperation({ summary: 'Get organization invitation details from token' })
    @ApiQuery({ name: 'invitation_token', required: true })
    async getInvitationDetails(@Query('invitation_token') invitation_token: string) {
        return this.authService.getInvitationDetails(invitation_token);
    }

    @Post('register-invitation')
    @ApiOperation({ summary: 'Complete account setup from an organization invitation' })
    @ApiBody({ type: RegisterInvitationDto })
    async registerFromInvitation(@Body() dto: RegisterInvitationDto) {
        return this.authService.registerFromInvitation(dto);
    }
}
