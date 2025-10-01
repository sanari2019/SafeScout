import { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types/job';

const RiskPill = ({ score }: { score?: number }) => {
  if (typeof score !== 'number') {
    return null;
  }
  const variant = score > 70 ? styles.pillHigh : score > 40 ? styles.pillMedium : styles.pillLow;
  return (
    <View style={[styles.pill, variant]}>
      <Text style={styles.pillText}>Risk {score}</Text>
    </View>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const price = typeof job.itemPrice === 'number' ? job.itemPrice : Number(job.itemPrice);
  return (
    <Link href={"/(tabs)/jobs/" + job.id} asChild>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{job.itemTitle}</Text>
          <Text style={styles.cardPrice}>£{Number.isFinite(price) ? price.toFixed(2) : job.itemPrice}</Text>
        </View>
        <Text style={styles.cardSubtitle}>{job.marketplace}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{job.tier} tier</Text>
          <Text style={styles.metaText}>{job.status}</Text>
        </View>
        <RiskPill score={job.riskScore} />
      </View>
    </Link>
  );
};

export default function JobsScreen() {
  const { data, isLoading, refetch, isRefetching } = useJobs();
  const jobs = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={jobs.length === 0 ? styles.emptyContainer : styles.listContent}
      renderItem={({ item }) => <JobCard job={item} />}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={() => (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No jobs yet</Text>
          <Text style={styles.emptySubtitle}>Create your first verification request to get started.</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  listContent: {
    padding: 16,
    gap: 12
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827'
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280'
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 6
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1D37'
  },
  cardSubtitle: {
    color: '#6B7280'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metaText: {
    color: '#4B5563'
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 4
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  pillHigh: {
    backgroundColor: '#DC2626'
  },
  pillMedium: {
    backgroundColor: '#F97316'
  },
  pillLow: {
    backgroundColor: '#16A34A'
  }
});
