import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistProps {
  title?: string;
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
}

const CheckItem: React.FC<{ item: ChecklistItem; onToggle?: (id: string) => void }> = ({ item, onToggle }) => {
  const opacity = useSharedValue(item.checked ? 0.5 : 1);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleToggle = () => {
    opacity.value = withTiming(item.checked ? 1 : 0.5, { duration: 200 });
    onToggle?.(item.id);
  };

  return (
    <Animated.View entering={FadeIn.duration(200)} style={[styles.checkItem, animStyle]}>
      <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
        <View style={[styles.checkboxInner, item.checked && styles.checkboxChecked]}>
          {item.checked && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text
        style={[
          styles.checkText,
          item.checked && styles.checkTextDone,
        ]}
      >
        {item.text}
      </Text>
    </Animated.View>
  );
};

export const Checklist: React.FC<ChecklistProps> = ({ title = 'Checklist', items, onToggle }) => {
  const checked = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? checked / items.length : 0;
  const progressWidth = useSharedValue(progress);

  React.useEffect(() => {
    const newProgress = items.length > 0 ? items.filter(i => i.checked).length / items.length : 0;
    progressWidth.value = withSpring(newProgress, { damping: 14, stiffness: 120 });
  }, [items]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.counter}>{checked}/{items.length}</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
      {items.map((item) => (
        <CheckItem key={item.id} item={item} onToggle={onToggle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  counter: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: radius.full,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  checkbox: {
    marginRight: spacing.sm,
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  checkText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    flex: 1,
  },
  checkTextDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
});
