import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException, HttpException } from '@nestjs/common';
import { RegisterEmailDto } from '../dto/register-email.dto';
import { LoginEmailDto } from '../dto/login-email.dto';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateJwtService } from '@/shared/utils/jwt/jwt.service';
import { AuthRoles } from '../interfaces/auth.interface';
import { WaitlistDto } from '../dto/waitlist.dto';
import { SendgridMailService } from '@/integrations/notifications/sendgrid/services/mail.service';
import { EmailConfig } from '@/shared/constants/email';
import { SwitchOrganizationDto } from '../dto/switch-organization.dto';
import { OrganizationMemberStatus } from 'generated/prisma';
import { OrganizationsService } from '@/modules/organizations/organizations.service';

@Injectable()
export class EmailAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt_service: CreateJwtService,
        private readonly mail_service: SendgridMailService,
        private readonly organizations_service: OrganizationsService,
    ) { }

    async registerWithEmail(dto: RegisterEmailDto) {

        try {
            const existing_user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (existing_user) {
                throw new ConflictException('User with this email already exists');
            }

            const hashed_password = await bcrypt.hash(dto.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashed_password,
                    role: AuthRoles.USER,
                },
            });

            const organization = await this.organizations_service.create(user.uuid, { name: 'Default Organisation' });
            const scoped_auth = await this.switchOrganization(user.uuid, { organization_uuid: organization.uuid });

            delete user.password;

            return { ...scoped_auth, user: user };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async loginWithEmail(dto: LoginEmailDto) {

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const password_match = await bcrypt.compare(dto.password, user.password);

            if (!password_match) {
                throw new UnauthorizedException('Invalid credentials');
            }


            const token = await this.jwt_service.signToken({
                uuid: user.uuid,
                role: user.role,
            });

            const expires_in = this.jwt_service.getExpirationTime(token);

            delete user.password;

            return { access_token: token, expires_in: expires_in, user: user };
        } catch (error) {
            throw new BadRequestException(error.message);
        }

    }

    async waitlist(dto: WaitlistDto) {

        try {
            const existing_user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (existing_user) {
                return { message: 'You are already in the waitlist', code: 'WAITLIST_ALREADY_EXISTS' };
            }

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: '',
                    role: AuthRoles.USER,
                },
            });

            await this.mail_service.sendEmail({
                to: dto.email,
                from: EmailConfig.email_addresses.alert,
                subject: EmailConfig.templates.waitlist.subject,
                template_id: EmailConfig.templates.waitlist.template_id,
            });


            return { message: 'You have been successfully added to the waitlist', code: 'WAITLIST_SUCCESS' };

        } catch (error) {
            throw new BadRequestException('Failed to waitlist user', error.message);
        }
    }

    async switchOrganization(user_uuid: string, dto: SwitchOrganizationDto) {
        try {
            const membership = await this.prisma.organizationMember.findFirst({
                where: {
                    user_uuid: user_uuid,
                    status: OrganizationMemberStatus.ACTIVE,
                    organization: {
                        uuid: dto.organization_uuid,
                    },
                },
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!membership) {
                throw new ForbiddenException('You are not an active member of this organization');
            }

            const organization_permissions = membership.role.permissions.map((role_permission) => role_permission.permission.key);
            const token = await this.jwt_service.signToken({
                uuid: user_uuid,
                organization_uuid: dto.organization_uuid,
                organization_role: membership.role.name,
                organization_permissions,
            });

            const expires_in = this.jwt_service.getExpirationTime(token);

            return {
                access_token: token,
                expires_in,
                organization_uuid: dto.organization_uuid,
                organization_role: membership.role.name,
                organization_permissions,
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof HttpException) {
            throw error;
        }

        const message = error instanceof Error ? error.message : 'Unexpected authentication error';
        throw new BadRequestException(message);
    }

}
