import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', isLoading, disabled, className }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const handlePressIn = () => { scale.value = withSpring(0.95); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  let bgClass = 'bg-black border border-fuchsia-500 shadow-lg shadow-fuchsia-500/50';
  let textClass = 'text-white font-bold tracking-widest';
  
  if (variant === 'secondary') {
    bgClass = 'bg-zinc-800 border-zinc-700';
    textClass = 'text-gray-300';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border border-cyan-400';
    textClass = 'text-cyan-400 font-bold';
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={animatedStyle}
      className={`h-14 rounded-2xl flex-row items-center justify-center px-6 ${bgClass} ${disabled ? 'opacity-50' : ''} ${className || ''}`}
    >
      {isLoading ? (
         <ActivityIndicator color={variant === 'outline' ? '#22d3ee' : '#fff'} />
      ) : (
         <Text className={`text-lg uppercase ${textClass}`}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};
