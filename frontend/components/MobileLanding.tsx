import { useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface MobileLandingProps {
  onVerify: () => void;
  onSignIn: () => void;
  onSkip?: () => void;
}

const steps = [
  {
    id: 1,
    title: 'Paste listing link',
    description: 'Drop in any marketplace URL and we take it from there.'
  },
  {
    id: 2,
    title: 'AI risk analysis',
    description: 'We highlight scam signals instantly so you know the risk level.'
  },
  {
    id: 3,
    title: 'Scout verifies in person',
    description: 'A trusted local expert inspects and reports back with photos and video.'
  }
];

export const MobileLanding = ({ onVerify, onSignIn, onSkip }: MobileLandingProps) => {
  const [step, setStep] = useState<0 | 1>(0);
  const screenWidth = Dimensions.get('window').width;
  const heroImageSize = Math.min(screenWidth * 0.7, 260);

  return (
    <View style={styles.container}>
      {step === 0 ? (
        <View style={styles.heroCard}>
          <Text style={styles.brand}>SafeScout</Text>
          <Text style={styles.title}>Marketplace protection in your pocket</Text>
          <Text style={styles.subtitle}>
            AI-powered checks plus real-world scouts so you never get scammed again.
          </Text>

          <View style={[styles.heroImage, { width: heroImageSize, height: heroImageSize }]}> 
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80' }}
              style={styles.image}
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={onVerify}>
            <Text style={styles.primaryButtonText}>Verify a listing now →</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={onSignIn}>
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </Pressable>

          <View style={styles.heroActions}>
            {onSkip ? (
              <Pressable onPress={onSkip}>
                <Text style={styles.linkText}>Skip</Text>
              </Pressable>
            ) : <View style={{ width: 48 }} />}
            <Pressable onPress={() => setStep(1)}>
              <Text style={styles.linkText}>Next</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>How SafeScout works</Text>
          {steps.map((stepItem) => (
            <View key={stepItem.id} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{stepItem.id}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{stepItem.title}</Text>
                <Text style={styles.stepDescription}>{stepItem.description}</Text>
              </View>
            </View>
          ))}

          <View style={styles.ctaRow}>
            <Pressable style={styles.primaryButton} onPress={onVerify}>
              <Text style={styles.primaryButtonText}>Verify a listing now →</Text>
            </Pressable>
            <Pressable style={styles.outlineButton} onPress={() => setStep(0)}>
              <Text style={styles.outlineButtonText}>Back</Text>
            </Pressable>
          </View>

          <Pressable style={styles.secondaryButton} onPress={onSignIn}>
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1D37',
    padding: 24,
    paddingBottom: 48,
    justifyContent: 'center'
  },
  heroCard: {
    backgroundColor: '#13294B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 20
  },
  brand: {
    color: '#9AB4FF',
    fontWeight: '600'
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700'
  },
  subtitle: {
    color: '#D0DCFF',
    textAlign: 'center',
    fontSize: 14
  },
  heroImage: {
    borderRadius: 20,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  primaryButton: {
    backgroundColor: '#4C6FFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9AB4FF',
    paddingVertical: 12,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#9AB4FF',
    fontSize: 15,
    fontWeight: '600'
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch'
  },
  linkText: {
    color: '#9AB4FF',
    fontSize: 14,
    fontWeight: '500'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1D37',
    textAlign: 'center'
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#4C6FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  stepBody: {
    flex: 1
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1D37'
  },
  stepDescription: {
    color: '#4B5A7A',
    fontSize: 14
  },
  ctaRow: {
    gap: 12
  },
  outlineButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0DCFF',
    paddingVertical: 12,
    alignItems: 'center'
  },
  outlineButtonText: {
    color: '#0B1D37',
    fontWeight: '600'
  }
});
