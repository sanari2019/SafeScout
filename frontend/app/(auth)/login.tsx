import { useState, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useLogin } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    try {
      await mutateAsync({ email, password });
      router.replace('/(tabs)/jobs');
    } catch (error) {
      Alert.alert('Login failed', 'Check your credentials and try again.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>SafeScout</Text>
          <Text style={styles.subtitle}>Sign in to protect your next purchase.</Text>
        </View>

        <FormInput
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          value={email}
          onChangeText={setEmail}
        />
        <FormInput
          ref={passwordRef}
          label="Password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton title={isPending ? 'Signing in…' : 'Sign in'} onPress={handleSubmit} disabled={isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 120
  },
  header: {
    marginBottom: 32
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0B1D37',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563'
  }
});
