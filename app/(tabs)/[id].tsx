import Colors from '@/constants/Colors';
import {
  getContributors,
  getLanguages,
  getReadme,
  getRepository,
  type Repository,
} from '@/services/github';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function RepositoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { data: repository } = useQuery<Repository>({
    queryKey: ['repository', id],
    queryFn: () => getRepository(id),
  });

  const { data: readme } = useQuery<string>({
    queryKey: ['readme', id],
    queryFn: () => getReadme(id),
    enabled: !!repository,
  });

  const { data: languages } = useQuery<Record<string, number>>({
    queryKey: ['languages', id],
    queryFn: () => getLanguages(id),
    enabled: !!repository,
  });

  const { data: contributors } = useQuery<any[]>({
    queryKey: ['contributors', id],
    queryFn: () => getContributors(id),
    enabled: !!repository,
  });

  const openLink = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  if (!repository) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const totalLines = Object.values(languages ?? {}).reduce((a, b) => a + b, 0);
  const languagePercentages = Object.entries(languages ?? {}).map(
    ([name, lines]) => ({
      name,
      percentage: ((lines / totalLines) * 100).toFixed(1),
    })
  );

  const markdownStyles = {
    body: { color: colors.text },
    code_block: {
      backgroundColor: colors.codeBackground,
      padding: 16,
      borderRadius: 8,
    },
    fence: {
      backgroundColor: colors.codeBackground,
      padding: 16,
      borderRadius: 8,
    },
    code_inline: {
      backgroundColor: colors.codeBackground,
      padding: 4,
      borderRadius: 4,
    },
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradient[0], colors.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          Platform.OS === 'web' && styles.webContent,
        ]}
      >
        <AnimatedBlurView
          entering={FadeInDown.delay(100)}
          intensity={80}
          style={[styles.card, { backgroundColor: colors.background }]}
        >
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>
              {repository.name}
            </Text>
            <View style={styles.stars}>
              <Ionicons name="star" size={16} color={colors.text} />
              <Text style={[styles.starsCount, { color: colors.text }]}>
                {repository.stargazers_count}
              </Text>
            </View>
          </View>

          {repository.description && (
            <Text style={[styles.description, { color: colors.text }]}>
              {repository.description}
            </Text>
          )}

          {repository.topics.length > 0 && (
            <View style={styles.topics}>
              {repository.topics.map((topic) => (
                <View
                  key={topic}
                  style={[styles.topic, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          )}

          {repository.homepage && (
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => openLink(repository.homepage)}
            >
              <Ionicons name="globe" size={20} color="white" />
              <Text style={styles.buttonText}>Visit Website</Text>
            </Pressable>
          )}

          {languagePercentages.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(200)}
              style={styles.languages}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Languages
              </Text>
              {languagePercentages.map(({ name, percentage }) => (
                <View key={name} style={styles.languageRow}>
                  <View style={styles.languageInfo}>
                    <View
                      style={[
                        styles.languageDot,
                        {
                          backgroundColor:
                            colors.languageColors[name] || colors.accent,
                        },
                      ]}
                    />
                    <Text style={[styles.languageName, { color: colors.text }]}>
                      {name}
                    </Text>
                  </View>
                  <Text style={[styles.percentage, { color: colors.text }]}>
                    {percentage}%
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}

          {contributors?.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(300)}
              style={styles.contributors}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Contributors
              </Text>
              <View style={styles.contributorsList}>
                {contributors.map((contributor) => (
                  <Pressable
                    key={contributor.id}
                    onPress={() => openLink(contributor.html_url)}
                    style={[
                      styles.contributor,
                      { backgroundColor: colors.codeBackground },
                    ]}
                  >
                    <Text
                      style={[styles.contributorName, { color: colors.text }]}
                    >
                      {contributor.login}
                    </Text>
                    <Text
                      style={[styles.contributions, { color: colors.text }]}
                    >
                      {contributor.contributions} commits
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {readme && (
            <Animated.View entering={FadeInDown.delay(400)}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                README
              </Text>
              <Markdown style={markdownStyles}>{readme}</Markdown>
            </Animated.View>
          )}
        </AnimatedBlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  webContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsCount: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 24,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topic: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  languages: {
    gap: 8,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  languageName: {
    fontSize: 16,
  },
  percentage: {
    fontSize: 14,
    opacity: 0.8,
  },
  contributors: {
    gap: 8,
  },
  contributorsList: {
    gap: 8,
  },
  contributor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contributions: {
    fontSize: 14,
    opacity: 0.8,
  },
});
