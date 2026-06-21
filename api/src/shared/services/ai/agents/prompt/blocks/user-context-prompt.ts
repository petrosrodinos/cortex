type UserContextInput = {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

function formatUserName(firstName: string | null, lastName: string | null): string | null {
  const parts = [firstName?.trim(), lastName?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
}

export function buildUserContextPromptBlock(user: UserContextInput): string | null {
  const name = formatUserName(user.first_name, user.last_name);
  const email = user.email?.trim();

  if (!name && !email) {
    return null;
  }

  const lines = ['Current authenticated user:'];

  if (name) {
    lines.push(`- Name: ${name}`);
  }

  if (email) {
    lines.push(`- Email: ${email}`);
  }

  lines.push(
    'When the user refers to themselves, "my email", "send to me", or similar without naming another recipient, use this email address.',
  );

  return lines.join('\n');
}
