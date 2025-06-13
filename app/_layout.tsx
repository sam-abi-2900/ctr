import 'react-native-get-random-values';
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, useSegments, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


// --- Authentication Context ---
interface AuthContextType {
  isAuthenticated: boolean;
  isTermsAccepted: boolean;
  setIsTermsAccepted: (accepted: boolean) => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const login = () => {
    if (isTermsAccepted) {
      setIsAuthenticated(true);
    }
  };

  const value = {
    isAuthenticated,
    isTermsAccepted,
    setIsTermsAccepted,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
// --- End Authentication Context ---

export function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAppGroup = segments[0] === '(app)';

    if (isAuthenticated) {
      // When authenticated, ensure we're in the app group
      if (!inAppGroup) {
        console.log('Authenticated, redirecting to app...');
        router.replace('/(app)/(tabs)' as any);
      }
    } else {
      // When not authenticated, ensure we're in the auth group
      if (inAppGroup) {
        console.log('Not authenticated, redirecting to login...');
        router.replace('/(auth)/login' as any);
      }
    }
  }, [isAuthenticated, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Slot /> */}
      </Stack>
      <StatusBar style="auto" />

    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
