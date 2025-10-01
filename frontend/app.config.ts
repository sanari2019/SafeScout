import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SafeScout',
  slug: 'safescout',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'safescout',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0B1D37'
  },
  userInterfaceStyle: 'automatic',
  plugins: ['expo-router', 'expo-font'],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B1D37'
    }
  },
  web: {
    bundler: 'metro',
    output: 'static'
  },
  experiments: {
    typedRoutes: true
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api'
  }
});
