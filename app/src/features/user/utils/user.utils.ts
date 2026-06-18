export function formatUserFullName(user: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return name || user.email?.split('@')[0] || 'A/N';
}
