import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { Avatar } from './Avatar';
import { Label } from './Label';
import { Checklist } from './Checklist';
import { CardData } from './TaskCard';
import dayjs from 'dayjs';

interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
}

interface CardDetailSheetProps {
  card: CardData & {
    labels?: { text: string; color: string }[];
    checklistItems?: ChecklistItemData[];
    members?: string[];
    comments?: { id: string; author: string; text: string; createdAt: string }[];
  };
  onClose: () => void;
  onUpdate?: (cardId: string, updates: Partial<CardData>) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CardDetailSheet: React.FC<CardDetailSheetProps> = ({ card, onClose, onUpdate }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? '');
  const [completed, setCompleted] = useState(card.completed ?? false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItemData[]>(
    card.checklistItems ?? []
  );

  const completeScale = useSharedValue(1);
  const completeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completeScale.value }],
  }));

  const handleMarkComplete = () => {
    completeScale.value = withSequence(
      withSpring(1.08, { damping: 6, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    const next = !completed;
    setCompleted(next);
    onUpdate?.(card.id, { completed: next });
  };

  const handleToggleChecklist = (itemId: string) => {
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        {/* Close button */}
        <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
          <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
        </Pressable>

        {/* Card label color strip */}
        {card.labelColor && (
          <View style={[styles.topStrip, { backgroundColor: card.labelColor }]} />
        )}

        {/* Title */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          multiline
          onBlur={() => onUpdate?.(card.id, { title })}
          placeholder="Card title…"
          placeholderTextColor={colors.textSecondary}
        />

        {/* Mark Complete button */}
        <AnimatedPressable
          style={[styles.completeBtn, completed && styles.completeBtnDone, completeAnimStyle]}
          onPress={handleMarkComplete}
        >
          <MaterialCommunityIcons
            name={completed ? 'check-circle' : 'check-circle-outline'}
            size={18}
            color={completed ? colors.textInverse : colors.success}
          />
          <Text style={[styles.completeBtnText, completed && styles.completeBtnTextDone]}>
            {completed ? 'Completed ✓' : 'Mark Complete'}
          </Text>
        </AnimatedPressable>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Members */}
        {(card.members ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MEMBERS</Text>
            <View style={styles.membersRow}>
              {(card.members ?? []).map((name, i) => (
                <Avatar key={i} name={name} size={32} style={{ marginRight: 6 }} />
              ))}
              <Pressable style={styles.addMemberBtn}>
                <MaterialCommunityIcons name="plus" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Labels */}
        {(card.labels ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LABELS</Text>
            <View style={styles.labelsRow}>
              {(card.labels ?? []).map((label, i) => (
                <Label key={i} text={label.text} color={label.color} />
              ))}
            </View>
          </View>
        )}

        {/* Due Date */}
        {card.dueDate && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DUE DATE</Text>
            <View style={styles.dueDateRow}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.dueDateText}>
                {dayjs(card.dueDate).format('MMM D, YYYY')}
              </Text>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <TextInput
            style={styles.descInput}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Add a more detailed description…"
            placeholderTextColor={colors.textSecondary}
            onBlur={() => onUpdate?.(card.id, { description })}
          />
        </View>

        {/* Checklist */}
        {checklistItems.length > 0 && (
          <View style={styles.section}>
            <Checklist items={checklistItems} onToggle={handleToggleChecklist} />
          </View>
        )}

        {/* Comments */}
        {(card.comments ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACTIVITY</Text>
            {(card.comments ?? []).map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Avatar name={comment.author} size={28} style={{ marginRight: 8 }} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>{dayjs(comment.createdAt).fromNow()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: colors.border,
    width: 40,
  },
  sheetContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: spacing.sm,
  },
  topStrip: {
    height: 6,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  titleInput: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.success,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  completeBtnDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  completeBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
    marginLeft: 6,
  },
  completeBtnTextDone: {
    color: colors.textInverse,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addMemberBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    marginLeft: 6,
    fontWeight: typography.fontWeight.medium,
  },
  descInput: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: typography.lineHeight.relaxed,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentAuthor: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal,
  },
  commentTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
