import { ComposioConnectionTier } from 'generated/prisma';
import {
  inferConnectionTierFromAccount,
  normalizeToolkitConnectionTierMap,
  resolveToolkitConnectionTiers,
} from './toolkit-connection-tiers.utils';

describe('toolkit-connection-tiers.utils', () => {
  it('infers connection tier from account ownership', () => {
    expect(inferConnectionTierFromAccount({ user_uuid: null })).toBe(
      ComposioConnectionTier.ORG_SHARED,
    );
    expect(inferConnectionTierFromAccount({ user_uuid: 'user-uuid' })).toBe(
      ComposioConnectionTier.USER_PERSONAL,
    );
  });

  it('resolves single-tier toolkits automatically', () => {
    const connectedTiersBySlug = new Map([
      ['gmail', new Set([ComposioConnectionTier.USER_PERSONAL])],
    ]);
    const toolkitNamesBySlug = new Map([['gmail', 'Gmail']]);

    expect(
      resolveToolkitConnectionTiers(
        ['gmail'],
        connectedTiersBySlug,
        toolkitNamesBySlug,
        {},
      ),
    ).toEqual({
      resolvedTierMap: { gmail: ComposioConnectionTier.USER_PERSONAL },
      ambiguousChoices: [],
    });
  });

  it('returns ambiguous choices when multiple tiers are connected without a preference', () => {
    const connectedTiersBySlug = new Map([
      [
        'linear',
        new Set([
          ComposioConnectionTier.ORG_SHARED,
          ComposioConnectionTier.USER_PERSONAL,
        ]),
      ],
    ]);
    const toolkitNamesBySlug = new Map([['linear', 'Linear']]);

    expect(
      resolveToolkitConnectionTiers(
        ['linear'],
        connectedTiersBySlug,
        toolkitNamesBySlug,
        {},
      ),
    ).toEqual({
      resolvedTierMap: {},
      ambiguousChoices: [
        {
          slug: 'linear',
          name: 'Linear',
          availableTiers: [
            ComposioConnectionTier.ORG_SHARED,
            ComposioConnectionTier.USER_PERSONAL,
          ],
        },
      ],
    });
  });

  it('normalizes provided tier maps', () => {
    expect(
      normalizeToolkitConnectionTierMap({
        linear: 'org_shared',
        gmail: 'USER_PERSONAL',
      }),
    ).toEqual({
      linear: ComposioConnectionTier.ORG_SHARED,
      gmail: ComposioConnectionTier.USER_PERSONAL,
    });
  });
});
