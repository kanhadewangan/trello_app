import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { useDataStore } from '../../store/useDataStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { fetchBoards } = useDataStore();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleSeedTestData = async () => {
    setIsSeeding(true);
    try {
      await api.testData.seed();
      await fetchBoards();
    } catch (error) {
      console.error('Failed to seed test data:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
       <View className="p-8 items-center pt-16">
          <View className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-fuchsia-500 shadow-xl shadow-fuchsia-500/30 items-center justify-center bg-zinc-900">
             <MaterialCommunityIcons name="alien-outline" size={60} color="#d946ef" />
          </View>
          <Text className="text-3xl font-bold text-white mb-2">{user?.name || 'User'}</Text>
          <Text className="text-cyan-400 font-medium mb-12">{user?.email}</Text>

          <View className="w-full space-y-4">
            <Button title="Edit Profile" onPress={() => {}} variant="secondary" className="mb-4" />
            <Button title="Seed Test Data" onPress={handleSeedTestData} variant="outline" className="mb-4" isLoading={isSeeding} />
            <Button title="Logout" onPress={handleLogout} variant="outline" className="mb-4" />
          </View>
       </View>
    </SafeAreaView>
  );
}
