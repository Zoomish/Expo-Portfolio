import FloatingObject from '@/components/FloatingObject';
import LiquidBackground from '@/components/LiquidBackground';
import Colors from '@/constants/Colors';
import { getUser } from '@/services/github';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const openLink = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LiquidBackground />

      <FloatingObject
        icon="logo-github"
        position={{ top: '15%', left: '15%' }}
        delay={0}
        onPress={() => user?.html_url && openLink(user.html_url)}
      />
      <FloatingObject
        icon="logo-twitter"
        position={{ top: '25%', right: '15%' }}
        delay={500}
        onPress={() => openLink('https://twitter.com')}
      />
      <FloatingObject
        icon="logo-linkedin"
        position={{ bottom: '35%', left: '20%' }}
        delay={1000}
        onPress={() => openLink('https://linkedin.com')}
      />
      <FloatingObject
        icon="mail"
        position={{ bottom: '45%', right: '20%' }}
        delay={1500}
        onPress={() => openLink('mailto:example@example.com')}
      />
      <FloatingObject
        icon="logo-discord"
        position={{ top: '40%', left: '30%' }}
        delay={2000}
        onPress={() => openLink('https://discord.com')}
      />
      <FloatingObject
        icon="logo-youtube"
        position={{ bottom: '25%', right: '35%' }}
        delay={2500}
        onPress={() => openLink('https://youtube.com')}
      />

      <BlurView
        intensity={80}
        style={[styles.content, isDesktop && { marginTop: 80 }]}
      >
        {isLoading ? (
          <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
        ) : (
          <>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.name}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Frontend Developer
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {process.env.EXPO_PUBLIC_GITHUB_TOKEN}
            </Text>
            <Text style={[styles.bio, { color: colors.text }]}>
              {user?.bio}
            </Text>

            <View style={styles.buttons}>
              <Pressable
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => openLink(`https://github.com/${user?.login}`)}
              >
                <Ionicons name="logo-github" size={24} color="white" />
                <Text style={styles.buttonText}>GitHub</Text>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: colors.secondary }]}
                onPress={() => openLink('https://t.me/Zoomish')}
              >
                <Ionicons name="paper-plane" size={24} color="white" />
                <Text style={styles.buttonText}>Telegram</Text>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: colors.accent }]}
                onPress={() => openLink('https://t.me/ZoomishBot')}
              >
                <Ionicons name="logo-android" size={24} color="white" />
                <Text style={styles.buttonText}>Bot</Text>
              </Pressable>
            </View>
          </>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 300,
    lineHeight: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
