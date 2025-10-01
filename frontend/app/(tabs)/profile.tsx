import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Profile</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Unknown'}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role ?? 'Unknown'}</Text>
      </View>
      <PrimaryButton title="Log out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: '#F3F4F6'
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1D37'
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280'
  },
  value: {
    fontSize: 16,
    color: '#1F2937'
  }
});
