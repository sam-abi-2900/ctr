import { authorize } from 'react-native-app-auth';

// Replace with your Azure AD values
const CLIENT_ID = 'YOUR_CLIENT_ID';
const TENANT_ID = 'YOUR_TENANT_ID';
const REDIRECT_URI = 'YOUR_REDIRECT_URI'; // e.g., msauth.com.yourcompany.yourapp://auth

const config = {
  issuer: `https://login.microsoftonline.com/${TENANT_ID}`,
  clientId: CLIENT_ID,
  redirectUrl: REDIRECT_URI,
  scopes: ['openid', 'profile', 'offline_access', 'User.Read'],
  serviceConfiguration: {
    authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
  },
};

export async function loginWithAzureAppAuth() {
  try {
    const result = await authorize(config);
    console.log('Access Token:', result.accessToken);
    console.log('ID Token:', result.idToken);
    console.log('Refresh Token:', result.refreshToken);
    return result;
  } catch (error) {
    console.error('Azure App Auth Error:', error);
    throw error;
  }
} 