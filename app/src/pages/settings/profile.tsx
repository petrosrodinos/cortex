import { ProfileTabs } from './components/profile-tabs';

export default function ProfilePage() {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <p className="mt-0.5 text-xs text-muted">Manage your account details and security settings.</p>
      </div>

      <ProfileTabs />
    </div>
  );
}
