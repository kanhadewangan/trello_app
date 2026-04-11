import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDataStore, Board } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BoardCard, CreateBoardCard } from '../../components/BoardCard';
import { BoardCardSkeleton } from '../../components/Skeleton';
import { Avatar } from '../../components/Avatar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function HomeScreen() {
  const { boards, fetchBoards, isLoading, toggleStar } = useDataStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchBoards();
  }, []);

  // Build list items: board items + create card at end
  const listData: (Board | 'create')[] = [...boards, 'create'];

  const renderItem = useCallback(
    ({ item, index }: { item: Board | 'create'; index: number }) => {
      if (item === 'create') {
        return (
          <CreateBoardCard
            index={index}
            onPress={() => router.push('/create-board')}
          />
        );
      }
      return (
        <BoardCard
          board={item}
          index={index}
          onPress={(b) => router.push(`/board/${b.id}`)}
          onStar={(b) => toggleStar(b.id)}
        />
      );
    },
    [toggleStar]
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Trello wordmark */}
          <View style={styles.logoMark}>
            <View style={[styles.logoBar, styles.logoBarLeft]} />
            <View style={[styles.logoBar, styles.logoBarRight]} />
          </View>
          <Text style={styles.logoText}>Trello</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/search')}>
            <MaterialCommunityIcons name="magnify" size={24} color={colors.textPrimary} />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Avatar name={user?.name} size={34} />
          </Pressable>
        </View>
      </View>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Boards</Text>
      </View>

      {/* Starred boards row (if any) */}
      {boards.some((b) => b.starred) && (
        <View style={styles.starredSection}>
          <View style={styles.starredTitleRow}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.starredTitle}>Starred</Text>
          </View>
          <FlatList
            data={boards.filter((b) => b.starred)}
            keyExtractor={(b) => b.id + '_star'}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.starredChip}
                onPress={() => router.push(`/board/${item.id}`)}
              >
                <View style={[styles.starredDot, { backgroundColor: item.color }]} />
                <Text style={styles.starredChipText} numberOfLines={1}>{item.title}</Text>
              </Pressable>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.base }}
          />
        </View>
      )}

      {/* Board grid */}
      {isLoading && boards.length === 0 ? (
        <FlatList
          data={Array(6).fill(null)}
          keyExtractor={(_, i) => `sk_${i}`}
          renderItem={() => <BoardCardSkeleton />}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, i) => (item === 'create' ? 'create' : item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchBoards}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
    height: 20,
  },
  logoBar: {
    width: 7,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  logoBarLeft: {
    height: 20,
    marginRight: 3,
  },
  logoBarRight: {
    height: 14,
  },
  logoText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  starredSection: {
    marginBottom: spacing.md,
  },
  starredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  starredTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  starredChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 160,
  },
  starredDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  starredChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    flexShrink: 1,
  },
  gridContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
