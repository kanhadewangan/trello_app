import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radius } from '../theme/spacing';

export interface BoardData {
  id: string;
  title: string;
  color?: string;
  starred?: boolean;
  cardCount?: number;
}

interface BoardCardProps {
  board: BoardData;
  index: number;
  onPress?: (board: BoardData) => void;
  onStar?: (board: BoardData) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BoardCard: React.FC<BoardCardProps> = ({ board, index, onPress, onStar }) => {
  const scale = useSharedValue(1);
  const bgColor = board.color ?? colors.boardColors[index % colors.boardColors.length];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(15)}
      style={styles.wrapper}
    >
      <AnimatedPressable
        style={[styles.card, { backgroundColor: bgColor }, animStyle]}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        onPress={() => onPress?.(board)}
      >
        {/* Subtle texture overlay */}
        <View style={styles.overlay} />

        <Text style={styles.title} numberOfLines={2}>{board.title}</Text>

        <Pressable
          style={styles.starBtn}
          hitSlop={8}
          onPress={() => onStar?.(board)}
        >
          <MaterialCommunityIcons
            name={board.starred ? 'star' : 'star-outline'}
            size={18}
            color={board.starred ? '#FFD700' : 'rgba(255,255,255,0.7)'}
          />
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const CreateBoardCard: React.FC<{ index: number; onPress: () => void }> = ({ index, onPress }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 80).springify().damping(15)}
    style={styles.wrapper}
  >
    <Pressable style={styles.createCard} onPress={onPress}>
      <MaterialCommunityIcons name="plus" size={28} color={colors.textSecondary} />
      <Text style={styles.createText}>Create board</Text>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
  },
  card: {
    height: 96,
    borderRadius: radius.lg,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: radius.lg,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    maxWidth: '80%',
  },
  starBtn: {
    alignSelf: 'flex-end',
  },
  createCard: {
    height: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: typography.fontWeight.medium,
  },
});
