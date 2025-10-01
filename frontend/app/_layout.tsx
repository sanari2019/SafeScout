import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '@/services/queryClient';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const screenOptions = {
  headerShown: false
} as const;

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={screenOptions} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
