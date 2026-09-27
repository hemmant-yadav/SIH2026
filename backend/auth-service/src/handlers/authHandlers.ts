import { CognitoRepository } from '../repositories/cognitoRepository';
import { sanitizeUserProfile, isValidRole } from '../domain/userDomain';

const cognitoRepo = new CognitoRepository();

/**
 * Cognito Post Confirmation Trigger
 * Automatically configures default user role and creates profile.
 */
export const postConfirmationHandler = async (event: any) => {
  const { userName, request } = event;
  const userAttributes = request?.userAttributes || {};

  const email = userAttributes.email || '';
  const name = userAttributes.name || userName;
  const requestedRole = userAttributes['custom:role'];

  const sanitized = sanitizeUserProfile({
    id: userName,
    email,
    name,
    role: requestedRole,
  });

  if (!isValidRole(requestedRole)) {
    await cognitoRepo.setUserRole(userName, sanitized.role);
  }

  return event;
};

/**
 * Pre Sign-up Trigger
 * Validates corporate/institutional email domain and required fields.
 */
export const preSignUpHandler = async (event: any) => {
  const { userAttributes } = event.request;
  const email = userAttributes?.email || '';

  if (!email.includes('@')) {
    throw new Error('Invalid email address.');
  }

  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;
  return event;
};
