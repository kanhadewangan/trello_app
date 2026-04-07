import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface ExpandableCardProps {
  title: string;
  description?: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({ title, description }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Animated.View layout={Layout.springify()}>
      <Pressable onPress={() => setExpanded(!expanded)} className="mb-3">
        <Card className="border border-white/5 bg-zinc-900/80 !p-4 !min-h-0">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-base flex-1">{title}</Text>
            <MaterialCommunityIcons 
               name={expanded ? "chevron-up" : "chevron-down"} 
               size={24} 
               color="#d946ef" 
            />
          </View>
          
          {expanded && (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="mt-3 pt-3 border-t border-white/10">
              <Text className="text-zinc-400 text-sm leading-relaxed">
                {description || 'No detailed description available for this card. Time to vibe check.'}
              </Text>
            </Animated.View>
          )}
        </Card>
      </Pressable>
    </Animated.View>
  );
};
