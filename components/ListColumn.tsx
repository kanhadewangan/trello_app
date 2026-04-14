import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { TaskCard, CardData } from './TaskCard';

interface ListSection {
  id: string;
  title: string;
  collapsed?: boolean;
}

interface ListColumnProps {
  id: string;
  title: string;
  cards: CardData[];
  sections?: ListSection[];
  onCardPress?: (card: CardData) => void;
  onAddCard?: (listId: string, title: string, sectionId?: string) => void;
  onToggleSection?: (sectionId: string) => void;
}

export const ListColumn: React.FC<ListColumnProps> = ({
  id,
  title,
  cards,
  sections = [],
  onCardPress,
  onAddCard,
  onToggleSection,
}) => {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard?.(id, newCardTitle.trim());
      setNewCardTitle('');
      setAddingCard(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
    onToggleSection?.(sectionId);
  };

  const getCardsBySection = (sectionId: string) => {
    return cards.filter((c) => c.listId === id);
  };

  return (
    <View style={styles.column}>
      {/* List Header */}
      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1}>{title}</Text>
        <Pressable hitSlop={8}>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Sections */}
      {sections.length > 0 ? (
        <View>
          {sections.map((section) => {
            const sectionCards = getCardsBySection(section.id);
            const isCollapsed = collapsedSections[section.id];

            return (
              <View key={section.id} style={styles.sectionContainer}>
                {/* Section Header */}
                <Pressable
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}
                >
                  <MaterialCommunityIcons
                    name={isCollapsed ? 'chevron-right' : 'chevron-down'}
                    size={18}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.cardCount}>{sectionCards.length}</Text>
                </Pressable>

                {/* Section Cards */}
                {!isCollapsed && (
                  <View>
                    {sectionCards.map((card) => (
                      <TaskCard key={card.id} card={card} onPress={onCardPress} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <View>
          {/* Cards (no sections) */}
          {cards.map((card) => (
            <TaskCard key={card.id} card={card} onPress={onCardPress} />
          ))}
        </View>
      )}

      {/* Add Card Input */}
      {addingCard ? (
        <Animated.View entering={FadeIn.duration(150)} style={styles.addCardInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter card title…"
            placeholderTextColor={colors.textSecondary}
            value={newCardTitle}
            onChangeText={setNewCardTitle}
            autoFocus
            multiline
          />
          <View style={styles.addCardActions}>
            <Pressable
              style={styles.addBtn}
              onPress={handleAddCard}
              android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
            >
              <MaterialCommunityIcons name="check" size={18} color="white" />
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setAddingCard(false);
                setNewCardTitle('');
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
            >
              <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>
      ) : (
        <Pressable
          style={styles.addCardBtn}
          onPress={() => setAddingCard(true)}
          android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
        >
          <MaterialCommunityIcons name="plus" size={18} color={colors.textSecondary} />
          <Text style={styles.addCardBtnText}>Add a card</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: 280,
    backgroundColor: '#EBECF0',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  headerText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },

  // Section Styles
  sectionContainer: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  cardCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  // Add Card Button - Mobile Optimized
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: spacing.sm,
  },
  addCardBtnText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: typography.fontWeight.medium,
  },

  // Add Card Input Form
  addCardInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
    marginTop: spacing.sm,
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  addCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Improved Mobile Button Sizing
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    minHeight: 44,
    gap: 6,
  },
  addBtnText: {
    color: colors.textInverse,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
  },
  cancelBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
});
