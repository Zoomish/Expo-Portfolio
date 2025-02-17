import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme, useWindowDimensions } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: isDesktop ? 'absolute' : 'relative',
          top: isDesktop ? 0 : undefined,
          bottom: isDesktop ? undefined : 0,
          left: 0,
          right: 0,
          height: Platform.select({
            ios: undefined,
            android: 60,
            web: isDesktop ? 60 : undefined,
          }),
          paddingBottom: Platform.select({
            ios: undefined,
            android: 10,
            web: isDesktop ? 0 : undefined,
          }),
          zIndex: 100,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarLabelStyle: {
          fontSize: isDesktop ? 14 : 12,
          marginBottom: Platform.select({
            android: 0,
            ios: undefined,
            web: isDesktop ? 0 : undefined,
          }),
        },
        tabBarIconStyle: Platform.select({
          android: {
            marginTop: 4,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="repositories"
        options={{
          title: 'Repositories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
