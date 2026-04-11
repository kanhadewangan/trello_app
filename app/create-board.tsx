import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useDataStore } from '../store/useDataStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

type Visibility = 'Private' | 'Workspace' | 'Public';

const VISIBILITY_OPTIONS: { label: Visibility; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { label: 'Private', icon: 'lock-outline' },
  { label: 'Workspace', icon: 'account-group-outline' },
  { label: 'Public', icon: 'earth' },
];

export default function CreateBoardScreen() {
  const { createBoard } = useDataStore();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors.boardColors[0]);
  const [visibility, setVisibility] = useState<Visibility>('Workspace');
  const [loading, setLoading] = useState(false);

  const btnScale = useSharedValue(1);
  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Board name required', 'Please enter a name for your board.');
      return;
    }
    btnScale.value = withSequence(
      withSpring(0.93, { damping: 4, stiffness: 400 }),
      withSpring(1.04, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    setLoading(true);
    try {
      await createBoard(name.trim(), selectedColor);
      router.back();
    } catch {
      Alert.alert('Error', 'Could not create board. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Board</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview card */}
          <View style={[styles.previewCard, { backgroundColor: selectedColor }]}>
            <View style={styles.previewOverlay} />
            <Text style={styles.previewTitle} numberOfLines={1}>
              {name || 'Board name'}
            </Text>
          </View>

          {/* Board name */}
          <Text style={styles.label}>Board Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Marketing Q3"
            placeholderTextColor={colors.textDisabled}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          {/* Color picker */}
          <Text style={styles.label}>Background</Text>
          <View style={styles.colorsRow}>
            {colors.boardColors.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorSwatchSelected,
                ]}
                onPress={() => setSelectedColor(c)}
              >
                {selectedColor === c && (
                  <MaterialCommunityIcons name="check" size={18} color="#fff" />
                )}
              </Pressable>
            ))}
          </View>

          {/* Visibility */}
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.visibilityRow}>
            {VISIBILITY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.label}
                style={[
                  styles.visChip,
                  visibility === opt.label && styles.visChipActive,
                ]}
                onPress={() => setVisibility(opt.label)}
              >
                <MaterialCommunityIcons
                  name={opt.icon}
                  size={15}
                  color={visibility === opt.label ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.visChipText,
                    visibility === opt.label && styles.visChipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Create button */}
          <Animated.View style={btnAnimStyle}>
            <Pressable
              style={[styles.createBtn, loading && styles.createBtnLoading]}
              onPress={handleCreate}
              disabled={loading}
            >
              <Text style={styles.createBtnText}>
                {loading ? 'Creating…' : 'Create Board'}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  previewCard: {
    height: 120,
    borderRadius: radius.xl,
    justifyContent: 'flex-end',
    padding: spacing.base,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  previewTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  visChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  visChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  visChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  visChipTextActive: {
    color: colors.textInverse,
  },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  createBtnLoading: {
    opacity: 0.7,
  },
  createBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
});
