import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MembersService } from './members.service';

describe('MembersService', () => {
  const prisma: any = {
    organization: {
      findUnique: jest.fn(),
    },
    organizationMember: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  };
  const organizations_service: any = {
    requireActiveMember: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizations_service.requireActiveMember.mockResolvedValue({
      role: { name: 'Owner', permissions: [] },
    });
  });

  it('wraps unexpected member lookup failures', async () => {
    prisma.organizationMember.findMany.mockRejectedValue(new Error('database offline'));
    const service = new MembersService(prisma, organizations_service);

    await expect(service.findAll('user-uuid', 'organization-uuid')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not remove organization owners', async () => {
    prisma.organization.findUnique.mockResolvedValue({ uuid: 'organization-uuid' });
    prisma.organizationMember.findFirst.mockResolvedValue({
      uuid: 'member-uuid',
      role: { name: 'Owner' },
    });
    const service = new MembersService(prisma, organizations_service);

    await expect(service.remove('manager-uuid', 'organization-uuid', 'member-uuid')).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.organizationMember.delete).not.toHaveBeenCalled();
  });
});
