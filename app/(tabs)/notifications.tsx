import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore, Notification } from '../../store/useDataStore';
import { useAuthStore } from '../../store/useAuthStore';
import { NotificationItem, NotificationData } from '../../components/NotificationItem';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function NotificationsScreen() {
  const { notifications, unreadCount, isLoading, fetchNotifications, fetchUnreadCount } = useDataStore();
  const { isHydrated, isAuthenticated, token } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Convert Notification to NotificationData for display
  const convertNotification = (notif: Notification): NotificationData => {
    return {
      id: notif.id,
      actor: notif.message.split(' ')[0] || 'User',
      action: notif.type === 'BOARD_INVITATION' ? 'invited you to' : 
              notif.type === 'GROUP_INVITATION' ? 'invited you to group' :
              notif.type === 'CARD_ASSIGNED' ? 'assigned you to' :
              notif.type === 'CARD_MOVED' ? 'moved a card to' :
              notif.type === 'COMMENT_ADDED' ? 'commented on' : 'notified you about',
      boardName: notif.message.split('"')[1] || 'a board',
      timestamp: notif.createdAt,
      read: notif.read,
    };
  };

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      fetchNotifications(20, 0);
      fetchUnreadCount();
    }
  }, [isHydrated, isAuthenticated, token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchNotifications(20, 0),
        fetchUnreadCount(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const displayNotifications = notifications.map(convertNotification);

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={displayNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <NotificationItem notification={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  emptyState: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
});
