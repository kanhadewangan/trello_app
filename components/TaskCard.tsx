import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { Avatar } from './Avatar';
import dayjs from 'dayjs';

export interface CardData {
  id: string;
  listId: string;
  title: string;
  description?: string;
  labelColor?: string;
  assigneeName?: string;
  dueDate?: string;
  attachmentCount?: number;
  commentCount?: number;
  completed?: boolean;
}

interface TaskCardProps {
  card: CardData;
  onPress?: (card: CardData) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TaskCard: React.FC<TaskCardProps> = ({ card, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isOverdue = card.dueDate
    ? dayjs(card.dueDate).isBefore(dayjs(), 'day')
    : false;

  return (
    <AnimatedPressable
      style={[styles.card, animStyle]}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={() => onPress?.(card)}
    >
      {/* Label color strip */}
      {card.labelColor && (
        <View style={[styles.labelStrip, { backgroundColor: card.labelColor }]} />
      )}

      <View style={styles.body}>
        <Text style={[styles.title, card.completed && styles.titleDone]} numberOfLines={3}>
          {card.title}
        </Text>

        {/* Footer row */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {card.dueDate && (
              <View style={[styles.badge, isOverdue && styles.badgeDanger, card.completed && styles.badgeSuccess]}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={11}
                  color={card.completed ? colors.success : isOverdue ? colors.danger : colors.textSecondary}
                />
                <Text style={[styles.badgeText, isOverdue && styles.badgeDangerText, card.completed && styles.badgeSuccessText]}>
                  {dayjs(card.dueDate).format('MMM D')}
                </Text>
              </View>
            )}
            {(card.attachmentCount ?? 0) > 0 && (
              <View style={styles.badge}>
                <MaterialCommunityIcons name="paperclip" size={11} color={colors.textSecondary} />
                <Text style={styles.badgeText}>{card.attachmentCount}</Text>
              </View>
            )}
            {(card.commentCount ?? 0) > 0 && (
              <View style={styles.badge}>
                <MaterialCommunityIcons name="comment-outline" size={11} color={colors.textSecondary} />
                <Text style={styles.badgeText}>{card.commentCount}</Text>
              </View>
            )}
          </View>

          {card.assigneeName && (
            <Avatar name={card.assigneeName} size={24} />
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  labelStrip: {
    height: 4,
    width: '100%',
  },
  body: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 4,
  },
  badgeDanger: {
    backgroundColor: colors.dangerLight,
  },
  badgeSuccess: {
    backgroundColor: colors.successLight,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  badgeDangerText: {
    color: colors.danger,
  },
  badgeSuccessText: {
    color: colors.success,
  },
});
