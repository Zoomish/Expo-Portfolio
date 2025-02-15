import Colors from '@/constants/Colors';
import { getRepositories, type Repository } from '@/services/github';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Link);

function RepositoryCard({ item, index }: { item: Repository; index: number }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSequence(withSpring(1.05), withSpring(1));
  };

  return (
    <AnimatedPressable
      href={`/${item.name}`}
      entering={FadeInDown.delay(index * 100)}
      exiting={FadeOut}
      style={[styles.cardWrapper, animatedStyle]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <BlurView
        intensity={80}
        style={[styles.card, { backgroundColor: colors.background }]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.repoName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View style={styles.stars}>
            <Ionicons name="star" size={16} color={colors.text} />
            <Text style={[styles.starsCount, { color: colors.text }]}>
              {item.stargazers_count}
            </Text>
          </View>
        </View>

        {item.description && (
          <Text
            style={[styles.description, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        {item.topics.length > 0 && (
          <View style={styles.topics}>
            {item.topics.slice(0, 3).map((topic) => (
              <View
                key={topic}
                style={[styles.topic, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {item.language && (
            <View style={styles.language}>
              <View
                style={[styles.languageDot, { backgroundColor: colors.accent }]}
              />
              <Text style={[styles.languageText, { color: colors.text }]}>
                {item.language}
              </Text>
            </View>
          )}
          <Text style={[styles.date, { color: colors.text }]}>
            Updated: {new Date(item.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

export default function RepositoriesScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const {
    data: repositories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories,
  });

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.text }]}>
          Error loading repositories
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={repositories}
        renderItem={({ item, index }) => (
          <RepositoryCard item={item} index={index} />
        )}
        key={isDesktop ? 'desktop' : 'mobile'}
        numColumns={isDesktop ? 2 : 1}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.list, isDesktop && styles.desktopList]}
        columnWrapperStyle={isDesktop && styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  desktopList: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: Platform.select({ web: '100%', default: undefined }),
  },
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
    height: '100%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repoName: {
    fontSize: 18,
    fontWeight: '600',
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
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  topics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topic: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  language: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
});
