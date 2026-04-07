import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <View className="w-full mb-4">
      {label && <Text className="text-gray-400 mb-2 ml-2 text-sm uppercase tracking-wider">{label}</Text>}
      <TextInput
        className={`h-14 bg-zinc-900 border ${error ? 'border-red-500' : 'border-zinc-800 focus:border-fuchsia-500'} rounded-2xl px-5 text-white font-medium ${className || ''}`}
        placeholderTextColor="#52525b"
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-2 ml-2">{error}</Text>}
    </View>
  );
};
