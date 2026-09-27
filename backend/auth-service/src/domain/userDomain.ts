import { UserProfile, UserRole } from '@messmind/shared-types';

const ALLOWED_ROLES: UserRole[] = [
  'kitchen_manager',
  'logistics_volunteer',
  'recipient_admin',
];

export const isValidRole = (role: string): role is UserRole => {
  return ALLOWED_ROLES.includes(role as UserRole);
};

export const sanitizeUserProfile = (input: {
  id: string;
  email: string;
  name: string;
  role?: string;
  facilityId?: string;
}): UserProfile => {
  const role: UserRole = isValidRole(input.role || '')
    ? (input.role as UserRole)
    : 'kitchen_manager';

  return {
    id: input.id,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    role,
    facilityId: input.facilityId?.trim(),
    createdAt: new Date().toISOString(),
  };
};

export const canManageFacility = (user: UserProfile, targetFacilityId: string): boolean => {
  if (user.role !== 'kitchen_manager') return false;
  return !user.facilityId || user.facilityId === targetFacilityId;
};
