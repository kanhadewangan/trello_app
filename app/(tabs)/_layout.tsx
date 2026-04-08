import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function TabLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#d946ef" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090b',
          borderTopColor: '#27272a',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
        },
        tabBarActiveTintColor: '#d946ef',
        tabBarInactiveTintColor: '#52525b',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cards" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="alien-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
