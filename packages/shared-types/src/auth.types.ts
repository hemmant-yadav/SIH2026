export type UserRole = 'kitchen_manager' | 'logistics_volunteer' | 'recipient_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  facilityId?: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  user: UserProfile;
}
