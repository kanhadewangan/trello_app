import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface LabelProps {
  text?: string;
  color?: string;
  style?: object;
}

export const Label: React.FC<LabelProps> = ({
  text,
  color = colors.labelColors.green,
  style,
}) => {
  if (!text) {
    // Render as color strip (no text)
    return (
      <View
        style={[styles.strip, { backgroundColor: color }, style]}
      />
    );
  }
  return (
    <View style={[styles.chip, { backgroundColor: color + '22', borderColor: color }, style]}>
      <Text style={[styles.chipText, { color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  strip: {
    height: 4,
    width: 40,
    borderRadius: 2,
    marginRight: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
