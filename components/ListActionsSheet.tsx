import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

interface ListActionsSheetProps {
  listId: string;
  listTitle: string;
  visible: boolean;
  onClose: () => void;
  onUpdate: (listId: string, newTitle: string) => Promise<void>;
  onDelete: (listId: string) => Promise<void>;
}

export const ListActionsSheet: React.FC<ListActionsSheetProps> = ({
  listId,
  listTitle,
  visible,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();
  const [editTitle, setEditTitle] = useState(listTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateList = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'List title cannot be empty');
      return;
    }

    if (editTitle === listTitle) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(listId, editTitle.trim());
      setIsEditing(false);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list and all its cards?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onDelete(listId);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete list');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      entering={FadeIn}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
        entering={SlideInUp}
      >
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List Actions</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isEditing ? (
            // Edit Mode
            <View style={styles.editSection}>
              <Text style={styles.label}>Edit List Title</Text>
              <TextInput
                style={styles.input}
                placeholder="List title"
                placeholderTextColor={colors.textSecondary}
                value={editTitle}
                onChangeText={setEditTitle}
                editable={!isLoading}
              />
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={() => {
                    setEditTitle(listTitle);
                    setIsEditing(false);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonTextSecondary}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={handleUpdateList}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            // Action Menu
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Current Title</Text>
                <View style={styles.titleDisplay}>
                  <Text style={styles.titleText}>{listTitle}</Text>
                </View>
              </View>

              <Pressable
                style={styles.actionButton}
                onPress={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={colors.textSecondary}
                />
                <Text style={styles.actionText}>Edit Title</Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={handleDeleteList}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="trash-can" size={20} color={colors.danger} />
                <Text style={[styles.actionText, styles.actionTextDanger]}>
                  Delete List
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '80%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  titleDisplay: {
    backgroundColor: colors.surfaceHover,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  titleText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  editSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  input: {
    backgroundColor: colors.surfaceHover,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontSize: typography.fontSize.base,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    color: '#fff',
    fontWeight: typography.fontWeight.semibold,
  },
  buttonTextSecondary: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHover,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  actionButtonDanger: {
    backgroundColor: 'rgba(222, 53, 11, 0.1)',
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  actionTextDanger: {
    color: colors.danger,
  },
});
