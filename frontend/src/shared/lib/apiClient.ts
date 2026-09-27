import { awsConfig } from './awsConfig';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || awsConfig.apiUrl;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('messmind_access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });
    if (!res.ok) {
      throw new Error(`API GET request failed with status ${res.status}`);
    }
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`API POST request failed with status ${res.status}`);
    }
    return res.json();
  }
}

export const apiClient = new ApiClient();
