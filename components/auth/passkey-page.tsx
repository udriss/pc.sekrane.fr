import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

interface AuthProvider {
  id: string;
  name: string;
}

interface AuthResponse {
  ok: boolean;
  error: string | undefined;
}

const providers = [{ id: 'passkey', name: 'Passkey' }];

const signIn = async (provider: AuthProvider, formData?: any, callbackUrl?: string) => {
  // Here we would implement actual WebAuthn/passkey logic
  const response: AuthResponse = await new Promise((resolve) => {
    setTimeout(() => {
      alert(`Signing in with ${provider.id}`);
      resolve({ ok: true, error: undefined });
    }, 500);
  });
  return response;
};

export default function PasskeySignInPage() {
  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false } }}
      />
    </AppProvider>
  );
}