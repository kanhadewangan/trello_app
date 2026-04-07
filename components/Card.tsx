import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <View className={`rounded-3xl border border-white/10 overflow-hidden ${className || ''}`}>
      <BlurView intensity={20} tint="dark" className="p-6 min-h-[120px] bg-black/60">
        {children}
      </BlurView>
    </View>
  );
};
