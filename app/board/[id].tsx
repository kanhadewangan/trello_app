import React, { useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore } from '../../store/useDataStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ExpandableCard } from '../../components/ExpandableCard';

export default function BoardScreen() {
  const { id } = useLocalSearchParams();
  const { lists, cards, fetchListsAndCards, boards } = useDataStore();
  const board = boards.find(b => b.id === id);

  useEffect(() => {
    if (id) {
      fetchListsAndCards(id as string);
    }
  }, [id]);

  const renderList = ({ item: list }: { item: any }) => {
    const listCards = cards.filter((c: any) => c.listId === list.id);
    return (
      <View className="w-72 mr-6 bg-zinc-900/50 border border-white/10 rounded-3xl p-4">
        <Text className="text-lg font-bold text-cyan-400 mb-4 uppercase tracking-widest">{list.title}</Text>
        {listCards.map((card: any) => (
          <ExpandableCard key={card.id} title={card.title} description={card.description} />
        ))}
        <Pressable className="mt-2 py-3 bg-white/5 rounded-xl border border-white/10 items-center">
            <Text className="text-fuchsia-500 font-bold">+ Add Card</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-6 py-4 flex-row items-center border-b border-white/5">
        <Pressable onPress={() => router.back()} className="mr-4">
          <MaterialCommunityIcons name="arrow-left" size={28} color="#d946ef" />
        </Pressable>
        <Text className="text-2xl font-black text-white">{board?.title || 'Board Details'}</Text>
      </View>
      
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderList}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1 p-6"
      />
    </SafeAreaView>
  );
}
