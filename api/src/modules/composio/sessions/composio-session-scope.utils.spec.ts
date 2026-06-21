import { ComposioConnectionTier } from 'generated/prisma';
import {
  filterToolkitsForComposioUserId,
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
});
