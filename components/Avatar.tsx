import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: object;
}

const getInitials = (name?: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getBgColor = (name?: string) => {
  const palette = ['#0052CC', '#00875A', '#FF5630', '#6554C0', '#FF8B00', '#00B8D9'];
  if (!name) return palette[0];
  const idx = name.charCodeAt(0) % palette.length;
  return palette[idx];
};

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 32, style }) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBgColor(name),
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: colors.textInverse,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
