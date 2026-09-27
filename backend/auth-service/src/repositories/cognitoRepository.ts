import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserProfile } from '@messmind/shared-types';

export class CognitoRepository {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;

  constructor(userPoolId?: string, region?: string) {
    this.client = new CognitoIdentityProviderClient({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.userPoolId = userPoolId || process.env.COGNITO_USER_POOL_ID || '';
  }

  async getUser(username: string): Promise<Partial<UserProfile> | null> {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      const response = await this.client.send(command);
      const attributes = (response.UserAttributes || []).reduce<Record<string, string>>(
        (acc: Record<string, string>, attr: any) => {
          if (attr.Name && attr.Value) acc[attr.Name] = attr.Value;
          return acc;
        },
        {}
      );

      return {
        id: response.Username,
        email: attributes['email'] || '',
        name: attributes['name'] || '',
        role: (attributes['custom:role'] as any) || 'kitchen_manager',
        facilityId: attributes['custom:facilityId'],
      };
    } catch (err) {
      console.error('Error fetching user from Cognito:', err);
      return null;
    }
  }

  async setUserRole(username: string, role: string, facilityId?: string): Promise<boolean> {
    try {
      const UserAttributes = [{ Name: 'custom:role', Value: role }];
      if (facilityId) {
        UserAttributes.push({ Name: 'custom:facilityId', Value: facilityId });
      }

      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        UserAttributes,
      });
      await this.client.send(command);
      return true;
    } catch (err) {
      console.error('Error setting user role in Cognito:', err);
      return false;
    }
  }
}
