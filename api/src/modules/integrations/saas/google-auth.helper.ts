import { loadRuntimePackage } from './saas-integration.base';

export async function createGoogleOAuthClient(config: Record<string, any>) {
  const { google } = await loadRuntimePackage('googleapis');
  const auth = new google.auth.OAuth2(config.clientId, config.clientSecret);
  auth.setCredentials({
    access_token: config.accessToken,
    refresh_token: config.refreshToken,
  });

  if (config.refreshToken) {
    await auth.getAccessToken();
  }

  return { google, auth };
}
