
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';

interface AnalysisResult {
  score: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  signals: { type: 'success' | 'warning'; text: string }[];
  title: string;
  price: string;
  location: string;
}

type VerificationStep = 'url' | 'analysis' | 'tier' | 'payment';

const tiers = [
  {
    id: 'lite',
    name: 'Lite',
    price: 19,
    features: ['Virtual verification', 'Video walkthrough', 'AI risk analysis', 'Basic report']
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 39,
    popular: true,
    features: ['In-person verification', 'Full inspection', 'Delivery coordination', 'Photos & video', 'Detailed report']
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 69,
    features: ['Priority scout', 'Negotiation help', 'Live tracking', 'Premium support']
  }
];

const tierDescriptions: Record<string, string> = {
  lite: 'Remote AI and scout review for instant red-flag checks.',
  standard: 'In-person verification with photos, video, and delivery coordination.',
  plus: 'Priority concierge, negotiation support, and live updates.'
};

const trustHighlights = [
  { icon: 'cpu', title: 'AI Risk Analysis', copy: 'Advanced models flag scam patterns instantly.' },
  { icon: 'eye', title: 'Professional Scouts', copy: 'Verified local experts inspect before you buy.' },
  { icon: 'shield', title: 'Secure Escrow', copy: 'Stripe holds funds until you approve.' }
];

const logoImage = require('../assets/logo_white.jpeg'); 


const testimonials = [
  {
    quote: 'Saved me from a £500 scam! The scout found out the iPhone was stolen before I made the trip.',
    name: 'Sarah Johnson'
  },
  {
    quote: 'The scout negotiated £100 off when they spotted damage I missed in the listing.',
    name: 'Mike Chen'
  },
  {
    quote: 'Worth every penny for expensive purchases. The report gave me total confidence.',
    name: 'Emma Wilson'
  }
];

const VerifyFlow = ({ onReset }: { onReset: () => void }) => {
  const [step, setStep] = useState<VerificationStep>('url');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedTier, setSelectedTier] = useState('standard');

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAnalysis({
      score: 35,
      risk: 'LOW',
      signals: [
        { type: 'warning', text: 'New seller account (15 days old)' },
        { type: 'success', text: 'Price within market range' },
        { type: 'success', text: 'Real photos detected (not stock imagery)' }
      ],
      title: 'iPhone 14 Pro • 256GB • Space Black',
      price: '£499',
      location: 'London, UK'
    });
    setIsAnalyzing(false);
    setStep('analysis');
  };

  const totalPrice = useMemo(() => {
    const base = tiers.find((tier) => tier.id === selectedTier)?.price ?? 0;
    return base + 15;
  }, [selectedTier]);

  return (
    <View style={styles.verifyRoot}>
      {step === 'url' && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Paste marketplace link</Text>
          <Text style={styles.cardCopy}>Works with Facebook Marketplace, eBay, Gumtree, Craigslist, Depop, and more.</Text>
          <TextInput
            style={styles.input}
            placeholder="https://facebook.com/marketplace/item/..."
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
          />
          <Pressable
            style={[styles.primaryButton, !url.trim() && styles.disabledButton]}
            onPress={handleAnalyze}
            disabled={!url.trim() || isAnalyzing}
          >
            <Text style={styles.primaryButtonText}>{isAnalyzing ? 'Analyzing…' : 'Analyze listing'}</Text>
          </Pressable>
        </View>
      )}

      {step === 'analysis' && analysis && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>AI risk report</Text>
          <Text style={styles.analysisTitle}>{analysis.title}</Text>
          <Text style={styles.analysisPrice}>{analysis.price}</Text>
          <Text style={styles.cardCopy}>{analysis.location}</Text>
          <View
            style={[
              styles.riskPill,
              analysis.risk === 'LOW'
                ? styles.lowRisk
                : analysis.risk === 'MEDIUM'
                ? styles.mediumRisk
                : styles.highRisk
            ]}
          >
            <Text style={styles.riskPillText}>
              {analysis.risk} risk • {analysis.score}/100
            </Text>
          </View>
          {analysis.signals.map((signal, idx) => (
            <View key={idx} style={styles.signalRow}>
              <Text style={styles.signalBullet}>{signal.type === 'success' ? '✔︎' : '⚠︎'}</Text>
              <Text style={styles.cardCopy}>{signal.text}</Text>
            </View>
          ))}
          <Pressable style={styles.secondaryButton} onPress={() => setStep('tier')}>
            <Text style={styles.secondaryButtonText}>Continue to protection levels</Text>
          </Pressable>
        </View>
      )}

      {step === 'tier' && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Choose your protection level</Text>
          {tiers.map((tier) => (
            <Pressable
              key={tier.id}
              onPress={() => setSelectedTier(tier.id)}
              style={[styles.tierCard, selectedTier === tier.id && styles.tierCardActive]}
            >
              {tier.popular ? (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>⭐ Most popular</Text>
                </View>
              ) : null}
              <View style={styles.tierHeader}>
                <Text style={styles.tierTitle}>{tier.name}</Text>
                <Text style={styles.tierPrice}>£{tier.price}</Text>
              </View>
              {tier.features.map((feature) => (
                <Text key={feature} style={styles.cardCopy}>• {feature}</Text>
              ))}
            </Pressable>
          ))}
          <Pressable style={styles.secondaryButton} onPress={() => setStep('payment')}>
            <Text style={styles.secondaryButtonText}>Continue to payment</Text>
          </Pressable>
        </View>
      )}

      {step === 'payment' && (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Secure checkout</Text>
          <Text style={styles.cardCopy}>We’ll redirect you to Stripe to finish the booking.</Text>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>£{totalPrice.toFixed(2)}</Text>
          <Pressable style={styles.primaryButton} onPress={onReset}>
            <Text style={styles.primaryButtonText}>Start another request</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default function WebIndex() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const howItWorksY = useRef(0);
  const protectionY = useRef(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [heroHeight, setHeroHeight] = useState(0);
  const shieldDrift = useRef(new Animated.Value(0)).current;
  const lockDrift = useRef(new Animated.Value(0)).current;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const createLoop = (value: Animated.Value, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            delay,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 6000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ])
      );

    const shieldLoop = createLoop(shieldDrift);
    const lockLoop = createLoop(lockDrift, 800);

    shieldLoop.start();
    lockLoop.start();

    return () => {
      shieldLoop.stop();
      lockLoop.stop();
    };
  }, [lockDrift, shieldDrift]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = heroHeight > 0 ? heroHeight - 80 : 140;
    setShowStickyNav(scrollY >= threshold);
  }; 

  if (token) {
    router.replace('/(tabs)/jobs');
    return null;
  }

  const handleScrollToHowItWorks = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: howItWorksY.current - 40, animated: true });
    }
  };

  const handleScrollToProtection = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: protectionY.current - 40, animated: true });
    }
  };

  const startVerify = () => {
    setShowVerify(true);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  const startSignIn = () => router.push('/(auth)/login');

  return (
    <View style={styles.webRoot}>
      {showStickyNav ? (
        <View style={styles.stickyNav}>
          <View style={styles.stickyBrandRow}>
            <Image source={logoImage} style={styles.stickyLogo} resizeMode="contain" />
            <Text style={styles.stickyBrandText}>SafeScout</Text>
          </View>
          <Pressable style={styles.navSignIn} onPress={startSignIn}>
            <Text style={styles.navSignInText}>Sign in</Text>
          </Pressable>
        </View>
      ) : null}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.webContent}
        onScroll={handleScroll}
      >
        <View style={styles.heroSection} onLayout={({ nativeEvent }) => setHeroHeight(nativeEvent.layout.height)}>
          <Animated.View
            style={[
              styles.heroDecorShieldLarge,
              {
                transform: [
                  {
                    translateY: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -26]
                    })
                  },
                  {
                    translateX: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 18]
                    })
                  },
                  {
                    rotate: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '4deg']
                    })
                  }
                ]
              }
            ]}
          >
            <Feather name="shield" size={64} color="#4C6FFF" />
          </Animated.View>
          <Animated.View
            style={[
              styles.heroDecorShieldSmall,
              {
                transform: [
                  {
                    translateY: lockDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20]
                    })
                  },
                  {
                    translateX: lockDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -16]
                    })
                  },
                  {
                    rotate: lockDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-6deg']
                    })
                  }
                ]
              }
            ]}
          >
            <Feather name="lock" size={48} color="#22C55E" />
          </Animated.View>
          <Animated.View
            style={[
              styles.heroDecorCheck,
              {
                transform: [
                  {
                    translateY: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15]
                    })
                  },
                  {
                    translateX: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 12]
                    })
                  },
                  {
                    rotate: shieldDrift.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-8deg']
                    })
                  }
                ]
              }
            ]}
          >
            <Feather name="check-circle" size={40} color="#8AA3FF" />
          </Animated.View>

          <View style={styles.heroContent}>
            <View style={styles.heroBrandHeadline}>
              <Image source={logoImage} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brand}>SafeScout</Text>
            </View>
            <Text style={styles.heroEyebrow}>Marketplace safety concierge</Text>
            <Text style={styles.heroTitle}>Never get scammed on marketplaces again</Text>
            <Text style={styles.heroCopy}>
              AI-powered verification plus trusted local scouts so you can buy Facebook Marketplace, eBay, and Gumtree finds with confidence—even when you don’t have the time.
            </Text>
            <View style={styles.heroActions}>
              <Pressable style={styles.primaryButton} onPress={startVerify}>
                <Text style={styles.primaryButtonText}>Verify a listing now</Text>
                <Feather name="arrow-right" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </Pressable>
              <Pressable style={styles.ghostButton} onPress={handleScrollToHowItWorks}>
                <Text style={styles.ghostButtonText}>How it works</Text>
              </Pressable>
            </View>
            <View style={styles.storeBadgesRow}>
              <Pressable style={styles.storeBadge}>
                <Feather name="apple" size={20} color="#FFFFFF" />
                <View>
                  <Text style={styles.storeBadgeSubtitle}>Download on the</Text>
                  <Text style={styles.storeBadgeTitle}>App Store</Text>
                </View>
              </Pressable>
              <Pressable style={styles.storeBadge}>
                <Feather name="play" size={20} color="#FFFFFF" />
                <View>
                  <Text style={styles.storeBadgeSubtitle}>Get it on</Text>
                  <Text style={styles.storeBadgeTitle}>Google Play</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Why buyers love SafeScout</Text>
          <View style={styles.gridThree}>
            {trustHighlights.map(({ icon, title, copy }) => (
              <View key={title} style={styles.glassTile}>
                <Feather name={icon as any} size={48} color="#4C6FFF" style={{ marginBottom: 16 }} />
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureCopy}>{copy}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[styles.sectionCard, styles.sectionMuted, styles.protectionSection]}
          onLayout={({ nativeEvent }) => {
            protectionY.current = nativeEvent.layout.y;
          }}
        >
          <Text style={[styles.sectionHeading, styles.sectionHeadingLight]}>Choose your protection level</Text>
          <Text style={[styles.sectionCopy, styles.sectionCopyLight]}>From virtual checks to full concierge service.</Text>
          <View style={styles.protectionGrid}>
            {tiers.map((tier) => (
              <View key={tier.id} style={[styles.protectionCard, tier.popular && styles.protectionCardPopular]}>
                {tier.popular ? (
                  <View style={styles.popularChip}>
                    <Text style={styles.popularChipText}>⭐ Most popular</Text>
                  </View>
                ) : null}
                <View style={styles.protectionHeader}>
                  <Text style={styles.protectionTierTitle}>{tier.name}</Text>
                  <Text style={styles.priceLarge}>£{tier.price}</Text>
                </View>
                <Text style={styles.protectionTierDescription}>{tierDescriptions[tier.id]}</Text>
                <View style={styles.protectionFeatureList}>
                  {tier.features.map((feature) => (
                    <View key={feature} style={styles.protectionFeatureRow}>
                      <Feather name="check" size={16} color="#9AB4FF" />
                      <Text style={styles.protectionFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <Pressable style={styles.protectionButton} onPress={startVerify}>
                  <Text style={styles.protectionButtonText}>Select {tier.name}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View
          style={styles.sectionCard}
          onLayout={({ nativeEvent }) => {
            howItWorksY.current = nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionHeading}>How SafeScout works</Text>
          <View style={styles.gridFour}>
            {['Paste link', 'AI analysis', 'Scout verifies', 'Deliver & approve'].map((title, idx) => (
              <View key={title} style={styles.timelineTile}>
                <View style={styles.timelineBadge}>
                  <Text style={styles.timelineBadgeText}>{idx + 1}</Text>
                </View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureCopy}>
                  {idx === 0 && 'Share any marketplace URL and tell us what you need help with.'}
                  {idx === 1 && 'Our AI flags risky language, pricing anomalies, and suspicious uploads.'}
                  {idx === 2 && 'A matched scout inspects, negotiates if needed, and shares photos + video.'}
                  {idx === 3 && 'Approve the report, release escrow, and optionally book delivery/assembly.'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, styles.sectionMuted]}>
          <Text style={[styles.sectionHeading, styles.sectionHeadingLight]}>Trusted by 10,000+ buyers</Text>
          <View style={styles.gridThree}>
            {testimonials.map(({ quote, name }) => (
              <View key={name} style={styles.glassTile}>
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, idx) => (
                    <Feather key={idx} name="star" size={16} color="#FACC15" />
                  ))}
                </View>
                <Text style={styles.testimonialQuote}>{quote}</Text>
                <Text style={styles.testimonialName}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        {showVerify ? <VerifyFlow onReset={() => setShowVerify(false)} /> : null}

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to shop safely?</Text>
          <Text style={styles.ctaCopy}>Join thousands of protected buyers today.</Text>
          <Pressable style={styles.primaryButton} onPress={startSignIn}>
            <Text style={styles.primaryButtonText}>Create an account</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerBrandBlock}>
              <View style={styles.footerBrandRow}>
                <Image source={logoImage} style={styles.brandLogoFooter} resizeMode="contain" />
                <Text style={styles.footerBrandText}>SafeScout</Text>
              </View>
              <Text style={styles.footerTagline}>Marketplace protection, verified scouts, and AI guardrails in one service.</Text>
              <View style={styles.footerSocialRow}>
                <View style={styles.footerSocialIcon}>
                  <Feather name="twitter" size={18} color="#E4EAFF" />
                </View>
                <View style={styles.footerSocialIcon}>
                  <Feather name="instagram" size={18} color="#E4EAFF" />
                </View>
                <View style={styles.footerSocialIcon}>
                  <Feather name="linkedin" size={18} color="#E4EAFF" />
                </View>
              </View>
              </View>
            </View>

            <View style={styles.footerColumns}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Product</Text>
                <Pressable onPress={handleScrollToHowItWorks}>
                  <Text style={styles.footerLink}>How it works</Text>
                </Pressable>
                <Pressable onPress={handleScrollToProtection}>
                  <Text style={styles.footerLink}>Pricing</Text>
                </Pressable>
                <Pressable onPress={startVerify}>
                  <Text style={styles.footerLink}>Start a verification</Text>
                </Pressable>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Company</Text>
                <Pressable onPress={startSignIn}>
                  <Text style={styles.footerLink}>Sign in</Text>
                </Pressable>
                <Text style={styles.footerLink}>About</Text>
                <Text style={styles.footerLink}>Careers</Text>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerHeading}>Support</Text>
                <Text style={styles.footerLink}>support@safescout.app</Text>
                <Text style={styles.footerLink}>+44 20 1234 5678</Text>
                <Text style={styles.footerLink}>Live chat (coming soon)</Text>
              </View>
            </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerSmall}>© {currentYear} SafeScout. All rights reserved.</Text>
            <View style={styles.footerLegalRow}>
              <Text style={styles.footerSmall}>Privacy</Text>
              <Text style={styles.footerSmall}>Terms</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.chatFab} onPress={() => setChatVisible(true)}>
        <Feather name="message-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.chatFabText}>Chat</Text>
      </Pressable>

      <Modal visible={chatVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Chat with SafeScout</Text>
            <Text style={styles.cardCopy}>We’re building live bot-chat support. For now, drop us a message at support@safescout.app and a scout success manager will respond within minutes.</Text>
            <Pressable style={styles.secondaryButton} onPress={() => setChatVisible(false)}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: '#0B1D37'
  },
  webContent: {
    //paddingBottom: 48
    minHeight: '100%',
  },
  heroSection: {
    paddingHorizontal: 32,
    paddingBottom: 72,
    paddingTop: 64,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: '100%'
  },
  heroTopBar: {
    width: '100%',
    maxWidth: 1120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 48
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stickyNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: 'rgba(8,19,39,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(154,180,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    zIndex: 30
  },
  stickyBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stickyLogo: {
    width: 36,
    height: 36,
    borderRadius: 10
  },
  stickyBrandText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  navSignIn: {
    borderWidth: 1,
    borderColor: 'rgba(228,234,255,0.4)',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(12,25,49,0.6)'
  },
  navSignInText: {
    color: '#E4EAFF',
    fontWeight: '600'
  },
  heroDecorShieldLarge: {
    position: 'absolute',
    top: 120,
    left: 64,
    opacity: 0.12
  },
  heroDecorShieldSmall: {
    position: 'absolute',
    bottom: 140,
    right: 80,
    opacity: 0.14
  },
  heroDecorCheck: {
    position: 'absolute',
    bottom: 220,
    left: '25%',
    opacity: 0.1
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 960,
    width: '100%'
  },
  heroBrandHeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 16
  },
  brand: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 18
  },
  heroEyebrow: {
    color: '#8AA3FF',
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 900
  },
  heroCopy: {
    color: '#D0DCFF',
    fontSize: 18,
    textAlign: 'center',
    maxWidth: 780,
    marginBottom: 28
  },
  heroActions: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  storeBadgesRow: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center'
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(228,234,255,0.22)',
    backgroundColor: 'rgba(12,25,49,0.6)'
  },
  storeBadgeSubtitle: {
    color: '#9AB4FF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  storeBadgeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  primaryButton: {
    backgroundColor: '#4C6FFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16
  },
  ghostButton: {
    paddingVertical: 14,
    paddingHorizontal: 20
  },
  ghostButtonText: {
    color: '#9AB4FF',
    fontWeight: '600',
    fontSize: 16
  },
  sectionCard: {
    marginHorizontal: 32,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8
  },
  sectionMuted: {
    backgroundColor: '#13294B',
    borderWidth: 1,
    borderColor: 'rgba(154,180,255,0.18)',
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0B1D37',
    marginBottom: 12
  },
  sectionCopy: {
    color: '#4B5A7A',
    fontSize: 16,
    marginBottom: 24
  },
  sectionHeadingLight: {
    color: '#E4EAFF'
  },
  sectionCopyLight: {
    color: '#B9C8FF'
  },
  protectionSection: {
    borderWidth: 1,
    borderColor: 'rgba(154,180,255,0.18)',
    position: 'relative',
    overflow: 'hidden'
  },
  gridThree: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20
  },
  gridFour: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20
  },
  glassTile: {
    flexBasis: '30%',
    minWidth: 240,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 24
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1D37',
    marginBottom: 8
  },
  featureCopy: {
    color: '#4B5A7A',
    fontSize: 14
  },
  protectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center'
  },
  protectionCard: {
    flexBasis: '30%',
    minWidth: 260,
    backgroundColor: 'rgba(9,23,47,0.78)',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(154,180,255,0.32)'
  },
  protectionCardPopular: {
    borderColor: '#4C6FFF',
    backgroundColor: 'rgba(25,47,89,0.9)',
    shadowColor: '#162B5C',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 }
  },
  protectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  protectionTierTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700'
  },
  protectionTierDescription: {
    color: '#B9C8FF',
    fontSize: 14,
    marginTop: 4
  },
  protectionFeatureList: {
    gap: 8,
    marginTop: 8,
    marginBottom: 20
  },
  protectionFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  protectionFeatureText: {
    color: '#E4EAFF',
    fontSize: 14
  },
  protectionButton: {
    marginTop: 12,
    alignSelf: 'stretch',
    backgroundColor: '#4C6FFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  protectionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  priceLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4C6FFF'
  },
  popularChip: {
    alignSelf: 'center',
    backgroundColor: '#4C6FFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12
  },
  popularChipText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  timelineTile: {
    flexBasis: '22%',
    minWidth: 200,
    backgroundColor: '#F3F6FF',
    borderRadius: 24,
    padding: 24
  },
  timelineBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#4C6FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  timelineBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12
  },
  testimonialQuote: {
    color: '#0B1D37',
    fontSize: 14,
    marginBottom: 16
  },
  testimonialName: {
    color: '#4B5A7A',
    fontWeight: '600'
  },
  verifyRoot: {
    marginHorizontal: 32,
    marginBottom: 32
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    gap: 16
  },
  cardHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0B1D37'
  },
  cardCopy: {
    color: '#4B5A7A',
    fontSize: 14
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0DCFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16
  },
  disabledButton: {
    opacity: 0.4
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1D37'
  },
  analysisPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4C6FFF'
  },
  riskPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  lowRisk: {
    backgroundColor: 'rgba(34,197,94,0.18)'
  },
  mediumRisk: {
    backgroundColor: 'rgba(234,179,8,0.25)'
  },
  highRisk: {
    backgroundColor: 'rgba(239,68,68,0.22)'
  },
  riskPillText: {
    fontWeight: '600',
    color: '#0B1D37'
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  signalBullet: {
    fontSize: 16,
    marginTop: 2
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9AB4FF',
    paddingVertical: 12,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#4C6FFF',
    fontWeight: '600'
  },
  tierCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0DCFF',
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    gap: 8
  },
  tierCardActive: {
    borderColor: '#4C6FFF',
    backgroundColor: '#EEF2FF'
  },
  popularBadge: {
    position: 'absolute',
    top: -14,
    left: '50%',
    transform: [{ translateX: -70 }],
    backgroundColor: '#4C6FFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tierTitle: {
    fontWeight: '600',
    color: '#0B1D37'
  },
  tierPrice: {
    color: '#4C6FFF',
    fontWeight: '700'
  },
  totalLabel: {
    color: '#4B5A7A',
    marginTop: 16
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B1D37'
  },
  ctaCard: {
    marginHorizontal: 32,
    marginBottom: 48,
    backgroundColor: '#4C6FFF',
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    gap: 12
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700'
  },
  ctaCopy: {
    color: '#E4EAFF',
    fontSize: 16,
    textAlign: 'center'
  },
  footer: {
    paddingHorizontal: 32,
    paddingVertical: 48,
    backgroundColor: '#09172F',
    borderTopWidth: 1,
    borderTopColor: 'rgba(154,180,255,0.12)'
  },
  footerContent: {
    maxWidth: 1120,
    alignSelf: 'center',
    width: '100%',
    gap: 32
  },
  footerBrandBlock: {
    gap: 16
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  brandLogoFooter: {
    width: 44,
    height: 44,
    borderRadius: 12
  },
  footerBrandText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 18
  },
  footerTagline: {
    color: '#B9C8FF',
    fontSize: 14,
    maxWidth: 360
  },
  footerSocialRow: {
    flexDirection: 'row',
    gap: 16
  },
  footerSocialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(154,180,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'space-between'
  },
  footerColumn: {
    minWidth: 160,
    gap: 12
  },
  footerHeading: {
    color: '#E4EAFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  footerLink: {
    color: '#B9C8FF',
    fontSize: 14
  },
  footerBottom: {
    maxWidth: 1120,
    alignSelf: 'center',
    width: '100%',
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(154,180,255,0.1)',
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12
  },
  footerSmall: {
    color: '#8295CC',
    fontSize: 12
  },
  footerLegalRow: {
    flexDirection: 'row',
    gap: 16
  },
  chatFab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#4C6FFF',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  chatFabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: 360,
    gap: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B1D37'
  }
});
