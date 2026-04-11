import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { TaskCard, CardData } from './TaskCard';

interface ListColumnProps {
  id: string;
  title: string;
  cards: CardData[];
  onCardPress?: (card: CardData) => void;
  onAddCard?: (listId: string, title: string) => void;
}

export const ListColumn: React.FC<ListColumnProps> = ({
  id,
  title,
  cards,
  onCardPress,
  onAddCard,
}) => {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard?.(id, newCardTitle.trim());
      setNewCardTitle('');
      setAddingCard(false);
    }
  };

  return (
    <View style={styles.column}>
      {/* List header */}
      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1}>{title}</Text>
        <MaterialCommunityIcons name="dots-horizontal" size={20} color={colors.textSecondary} />
      </View>

      {/* Cards */}
      {cards.map((card) => (
        <TaskCard key={card.id} card={card} onPress={onCardPress} />
      ))}

      {/* Add card inline input */}
      {addingCard ? (
        <Animated.View entering={FadeIn.duration(150)} style={styles.addCardInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter a title for this card…"
            placeholderTextColor={colors.textSecondary}
            value={newCardTitle}
            onChangeText={setNewCardTitle}
            autoFocus
            multiline
          />
          <View style={styles.addCardActions}>
            <Pressable style={styles.addBtn} onPress={handleAddCard}>
              <Text style={styles.addBtnText}>Add card</Text>
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => {
                setAddingCard(false);
                setNewCardTitle('');
              }}
            >
              <MaterialCommunityIcons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </Animated.View>
      ) : (
        <Pressable
          style={styles.addCardBtn}
          onPress={() => setAddingCard(true)}
        >
          <MaterialCommunityIcons name="plus" size={16} color={colors.textSecondary} />
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
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  headerText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
  },
  addCardBtnText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  addCardInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 2,
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  addCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  addBtnText: {
    color: colors.textInverse,
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
  },
  cancelBtn: {
    padding: 4,
  },
});
