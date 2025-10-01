import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useJobs } from '@/hooks/useJobs';

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useJobs();

  const job = useMemo(() => data?.find((item) => item.id === params.id), [data, params.id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Job not found.</Text>
      </View>
    );
  }

  const price = typeof job.itemPrice === 'number' ? job.itemPrice : Number(job.itemPrice);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>{job.itemTitle}</Text>
        <Text style={styles.price}>£{Number.isFinite(price) ? price.toFixed(2) : job.itemPrice}</Text>
        <Text style={styles.meta}>Marketplace: {job.marketplace}</Text>
        <Text style={styles.meta}>Tier: {job.tier}</Text>
        <Text style={styles.meta}>Status: {job.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk analysis</Text>
        <Text style={styles.meta}>Score: {job.riskScore ?? 'Pending'}</Text>
        <Text style={styles.meta}>Recommendation: {job.riskRecommendation ?? 'Pending'}</Text>
        {job.riskSignals?.map((signal) => (
          <Text key={signal} style={styles.listItem}>• {signal}</Text>
        ))}
        {job.riskExplanation ? <Text style={styles.body}>{job.riskExplanation}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        {job.itemPhotos.map((photo) => (
          <Text key={photo} style={styles.link}>{photo}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    fontSize: 16,
    color: '#6B7280'
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1D37'
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  meta: {
    color: '#4B5563'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  listItem: {
    color: '#374151'
  },
  body: {
    color: '#1F2937'
  },
  link: {
    color: '#2563EB'
  }
});
