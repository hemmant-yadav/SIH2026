import { AuthSession } from '@messmind/shared-types';

export const authApi = {
  async getSession(): Promise<AuthSession | null> {
    const raw = localStorage.getItem('messmind_auth_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async mockLogin(role: 'kitchen_manager' | 'logistics_volunteer' = 'kitchen_manager'): Promise<AuthSession> {
    const session: AuthSession = {
      accessToken: 'mock-cognito-access-token',
      idToken: 'mock-cognito-id-token',
      refreshToken: 'mock-cognito-refresh-token',
      user: {
        id: 'usr-1234',
        email: 'manager@dininghall.edu',
        name: 'Chef Marcus Vance',
        role,
        facilityId: 'campus-dining-1',
        createdAt: new Date().toISOString(),
      },
    };
    localStorage.setItem('messmind_auth_session', JSON.stringify(session));
    localStorage.setItem('messmind_access_token', session.accessToken);
    return session;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('messmind_auth_session');
    localStorage.removeItem('messmind_access_token');
  },
};
