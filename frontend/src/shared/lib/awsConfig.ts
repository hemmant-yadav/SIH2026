export const awsConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.messmind.local/prod',
  wsUrl: import.meta.env.VITE_WS_URL || 'wss://ws.messmind.local/prod',
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_example',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'exampleclientid',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  },
};
