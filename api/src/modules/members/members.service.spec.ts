import { BadRequestException } from '@nestjs/common';
import { MembersService } from './members.service';

describe('MembersService', () => {
  const prisma: any = {
    organizationMember: {
      findMany: jest.fn(),
    },
  };
  const organizations_service: any = {
    require_active_member: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizations_service.require_active_member.mockResolvedValue({
      role: { name: 'Owner', permissions: [] },
    });
  });

  it('wraps unexpected member lookup failures', async () => {
    prisma.organizationMember.findMany.mockRejectedValue(new Error('database offline'));
    const service = new MembersService(prisma, organizations_service);

    await expect(service.findAll('user-uuid', 'organization-uuid')).rejects.toBeInstanceOf(BadRequestException);
  });
});
