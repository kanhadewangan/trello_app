import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDataStore, CardItem, ListItem } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ListColumn } from '../../components/ListColumn';
import { CardDetailSheet } from '../../components/CardDetailSheet';
import { ListActionsSheet } from '../../components/ListActionsSheet';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function BoardScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { lists, cards, boards, fetchListsAndCards, createList, createCard, updateCard, updateList, deleteList, isLoading } =
    useDataStore();

  const board = boards.find((b) => b.id === id);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [selectedList, setSelectedList] = useState<ListItem | null>(null);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const { isHydrated, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Only attempt fetch if we are hydrated to avoid premature requests missing tokens
    if (id && isHydrated && isAuthenticated) {
      fetchListsAndCards(id);
    }
  }, [id, isHydrated, isAuthenticated, token]);

  const boardLists = lists.filter((l) => l.boardId === id);

  const handleAddCard = async (listId: string, title: string) => {
    await createCard(listId, title);
  };

  const handleAddList = async (title: string) => {
    if (!id) {
      console.error('Board ID is not available');
      setAddingList(false);
      return;
    }
    try {
      await createList(id, title);
      setNewListTitle('');
      setAddingList(false);
    } catch (error) {
      console.error('Failed to create list:', error);
      setAddingList(false);
    }
  };

  const handleListMenuPress = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (list) {
      setSelectedList(list);
    }
  };

  const handleUpdateList = async (listId: string, newTitle: string) => {
    await updateList(listId, newTitle);
  };

  const handleDeleteList = async (listId: string) => {
    await deleteList(listId);
  };

  return (
    <View style={[styles.root, { backgroundColor: board?.color ?? colors.primary }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Board header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {board?.title ?? 'Board'}
          </Text>
          <Pressable hitSlop={8}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Lists */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listsContent}
          decelerationRate="fast"
          snapToInterval={296}   // column 280 + margin 16
          snapToAlignment="start"
        >
          {boardLists.map((list) => {
            const listCards = cards.filter((c) => c.listId === list.id);
            return (
              <ScrollView
                key={list.id}
                style={styles.listScrollWrapper}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <ListColumn
                  id={list.id}
                  title={list.title}
                  cards={listCards}
                  onCardPress={(card) => setSelectedCard(card)}
                  onAddCard={handleAddCard}
                  onMenuPress={handleListMenuPress}
                />
              </ScrollView>
            );
          })}

          {/* Add another list */}
          {addingList ? (
            <Animated.View key="add-list-form" entering={FadeIn.duration(150)} style={styles.addListForm}>
              <TextInput
                style={styles.listInput}
                placeholder="Enter list name…"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={newListTitle}
                onChangeText={setNewListTitle}
                autoFocus
                maxLength={100}
              />
              <View style={styles.addListActions}>
                <Pressable
                  style={styles.confirmBtn}
                  onPress={() => {
                    if (newListTitle.trim()) {
                      handleAddList(newListTitle.trim());
                    }
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.2)' }}
                >
                  <MaterialCommunityIcons name="check" size={18} color="#fff" />
                  <Text style={styles.confirmBtnText}>Add</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setAddingList(false);
                    setNewListTitle('');
                  }}
                  android_ripple={{ color: 'rgba(0,0,0,0.2)' }}
                >
                  <MaterialCommunityIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </Pressable>
              </View>
            </Animated.View>
          ) : (
            <Pressable
              key="add-list-btn"
              style={styles.addListBtn}
              onPress={() => setAddingList(true)}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              <Text style={styles.addListText}>Add another list</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Card detail bottom sheet */}
      {selectedCard && (
        <CardDetailSheet
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={(cardId, updates) => updateCard(cardId, updates)}
        />
      )}

      {/* List actions bottom sheet */}
      {selectedList && (
        <ListActionsSheet
          listId={selectedList.id}
          listTitle={selectedList.title}
          visible={!!selectedList}
          onClose={() => setSelectedList(null)}
          onUpdate={handleUpdateList}
          onDelete={handleDeleteList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backBtn: {
    marginRight: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listsContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  listScrollWrapper: {
    maxHeight: '100%',
    flexGrow: 0,
    marginRight: spacing.md,
  },
  addListBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: 200,
    alignSelf: 'flex-start',
  },
  addListText: {
    color: '#fff',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
    marginLeft: 6,
  },
  addListForm: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    padding: spacing.md,
    width: 200,
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  listInput: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    minHeight: 40,
  },
  addListActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
  },
  cancelBtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: radius.md,
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
