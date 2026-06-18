import { useState } from 'react';
import { Tabs } from '@heroui/react';
import { ProfileAccountForm } from './profile-account-form';
import { ProfilePasswordForm } from './profile-password-form';

const profileTabs = {
  account: {
    label: 'Account',
    description: 'View and update your account information.',
  },
  password: {
    label: 'Password',
    description: 'Update your account password.',
  },
} as const;

type ProfileTabKey = keyof typeof profileTabs;

export function ProfileTabs() {
  const [selectedTab, setSelectedTab] = useState<ProfileTabKey>('account');
  const activeTab = profileTabs[selectedTab];

  return (
    <Tabs
      className="w-full"
      variant="secondary"
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as ProfileTabKey)}
    >
      <Tabs.ListContainer className="flex justify-start overflow-x-auto">
        <Tabs.List
          aria-label="Profile settings"
          className="h-auto w-fit shrink-0 border-border *:h-10 *:min-h-10 *:px-5 *:text-sm *:font-medium"
        >
          <Tabs.Tab id="account">
            Account
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="password">
            Password
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <div className="mt-4 border-b border-border pb-4">
        <p className="text-sm font-medium text-foreground">{activeTab.label}</p>
        <p className="mt-1 text-xs text-muted">{activeTab.description}</p>
      </div>

      <Tabs.Panel className="mt-4 p-0" id="account">
        <ProfileAccountForm />
      </Tabs.Panel>

      <Tabs.Panel className="mt-4 p-0" id="password">
        <ProfilePasswordForm />
      </Tabs.Panel>
    </Tabs>
  );
}
