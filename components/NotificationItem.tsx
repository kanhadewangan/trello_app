import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Avatar } from './Avatar';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export interface NotificationData {
  id: string;
  actor: string;
  action: string;
  boardName: string;
  timestamp: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: NotificationData;
  index: number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, index }) => (
  <Animated.View
    entering={FadeInRight.delay(index * 60).springify().damping(18)}
    style={[styles.container, !notification.read && styles.unread]}
  >
    {!notification.read && <View style={styles.unreadBorder} />}
    <Avatar name={notification.actor} size={40} style={styles.avatar} />
    <View style={styles.content}>
      <Text style={styles.text}>
        <Text style={styles.actor}>{notification.actor} </Text>
        {notification.action}{' '}
        <Text style={styles.boardName}>{notification.boardName}</Text>
      </Text>
      <Text style={styles.time}>{dayjs(notification.timestamp).fromNow()}</Text>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  unread: {
    backgroundColor: '#E9F1FF',
  },
  unreadBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
  avatar: {
    marginRight: spacing.md,
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal,
  },
  actor: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  boardName: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  time: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
