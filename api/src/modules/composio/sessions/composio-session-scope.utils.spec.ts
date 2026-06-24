import { ComposioConnectionTier } from 'generated/prisma';
import {
  filterToolkitsForComposioUserId,
  getSessionConnectedToolkitSlugs,
  resolveComposioUserIdFromTierMap,
} from './composio-session-scope.utils';

describe('composio-session-scope.utils', () => {
  it('uses org session when scoped tiers are org-only', () => {
    expect(
      resolveComposioUserIdFromTierMap(
        'org-uuid',
        'user-uuid',
        ['linear', 'notion'],
        { linear: ComposioConnectionTier.ORG_SHARED },
        false,
      ),
    ).toBe('org:org-uuid');
  });

  it('uses user session when scoped tiers include personal connections', () => {
    expect(
      resolveComposioUserIdFromTierMap(
        'org-uuid',
        'user-uuid',
        ['linear', 'gmail'],
        {
          linear: ComposioConnectionTier.ORG_SHARED,
          gmail: ComposioConnectionTier.USER_PERSONAL,
        },
        false,
      ),
    ).toBe('user:user-uuid');
  });

  it('filters org toolkits out of user-scoped sessions', () => {
    expect(
      filterToolkitsForComposioUserId(
        ['linear', 'gmail'],
        {
          linear: ComposioConnectionTier.ORG_SHARED,
          gmail: ComposioConnectionTier.USER_PERSONAL,
        },
        'user:user-uuid',
      ),
    ).toEqual(['gmail']);
  });

  it('marks only session-compatible toolkits as connected', () => {
    expect(
      getSessionConnectedToolkitSlugs(
        ['github', 'resend'],
        {
          github: ComposioConnectionTier.USER_PERSONAL,
          resend: ComposioConnectionTier.ORG_SHARED,
        },
        [
          {
            slug: 'github',
            user_uuid: 'user-uuid',
            composio_user_id: 'user:user-uuid',
          },
          {
            slug: 'resend',
            user_uuid: null,
            composio_user_id: 'org:org-uuid',
          },
        ],
        'org-uuid',
        'user-uuid',
        false,
      ),
    ).toEqual(new Set(['github']));
  });

  it('binds org toolkits when the session is org-scoped', () => {
    expect(
      getSessionConnectedToolkitSlugs(
        ['resend'],
        { resend: ComposioConnectionTier.ORG_SHARED },
        [
          {
            slug: 'resend',
            user_uuid: null,
            composio_user_id: 'org:org-uuid',
          },
        ],
        'org-uuid',
        'user-uuid',
        false,
      ),
    ).toEqual(new Set(['resend']));
  });
});
