import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  style?: object;
  borderRadius?: number;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = 16,
  style,
  borderRadius = radius.md,
}) => {
  const shimmer = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeletonBase, colors.skeletonHighlight],
  });

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius, backgroundColor }, style]}
    />
  );
};

export const BoardCardSkeleton: React.FC = () => (
  <View style={styles.boardCardWrapper}>
    <SkeletonBox height={96} borderRadius={12} />
  </View>
);

export const TaskCardSkeleton: React.FC = () => (
  <View style={styles.taskCardWrapper}>
    <SkeletonBox height={4} width={40} style={{ marginBottom: 10 }} />
    <SkeletonBox height={14} width="85%" style={{ marginBottom: 6 }} />
    <SkeletonBox height={14} width="60%" style={{ marginBottom: 10 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <SkeletonBox height={20} width={50} borderRadius={4} style={{ marginRight: 6 }} />
      <SkeletonBox height={20} width={30} borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  boardCardWrapper: {
    flex: 1,
    margin: 6,
  },
  taskCardWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
});
