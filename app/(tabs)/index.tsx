import React, { useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useDataStore } from '../../store/useDataStore';
import { Card } from '../../components/Card';
import { Skeleton } from '../../components/Skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const { boards, fetchBoards, isLoading } = useDataStore();

  useEffect(() => {
    fetchBoards();
  }, []);

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 150).springify()}>
      <Card className="mb-4 mx-4">
        <Pressable className="flex-row items-center justify-between" onPress={() => router.push(`/board/${item.id}`)}>
            <View>
              <Text className="text-xl font-bold text-white mb-2">{item.title || 'Untitled Board'}</Text>
              <Text className="text-zinc-400 text-sm">ID: {item.id}</Text>
            </View>
            <MaterialCommunityIcons name="arrow-right-circle" size={32} color="#22d3ee" />
        </Pressable>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 py-6 border-b border-white/5 flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-black text-white tracking-widest">FEED.</Text>
        <MaterialCommunityIcons name="bell-ring" size={24} color="#d946ef" />
      </View>
      {isLoading && boards.length === 0 ? (
        <View className="px-4 space-y-4">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </View>
      ) : (
        <FlatList
          data={boards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchBoards} tintColor="#d946ef" />
          }
        />
      )}
    </SafeAreaView>
  );
}
