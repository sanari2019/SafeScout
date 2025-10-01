import { Redirect, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { MobileLanding } from '@/components/MobileLanding';

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  if (token) {
    return <Redirect href="/(tabs)/jobs" />;
  }

  if (Platform.OS === 'web') {
    return null;
  }

  const handleVerify = () => {
    router.push('/(auth)/login');
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
  };

  const handleSkip = () => {
    router.push('/(tabs)/jobs');
  };

  return (
    <MobileLanding
      onVerify={handleVerify}
      onSignIn={handleSignIn}
      onSkip={handleSkip}
    />
  );
}
