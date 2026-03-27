import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { ProfileProvider } from './ProfileProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <ProfileProvider>
        {children}
      </ProfileProvider>
    </AuthProvider>
  );
}
