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
          height: isDesktop ? 60 : undefined,
          zIndex: 100,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: {
          fontSize: isDesktop ? 14 : 12,
        },
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
