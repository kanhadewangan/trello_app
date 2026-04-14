import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDataStore } from '../../store/useDataStore';
import { colors } from '../../theme/colors';

export default function CreateBoardScreen() {
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { createBoard } = useDataStore();

  const handleCreateBoard = async () => {
    if (!boardTitle.trim()) {
      Alert.alert('Error', 'Please enter a board title');
      return;
    }

    setLoading(true);
    try {
      await createBoard(boardTitle, colors.boardColors[0]);
      Alert.alert('Success', 'Board created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create board. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-2 py-2 min-h-[44px] justify-center"
          >
            <Text className="text-base text-blue-500">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold">Create Board</Text>
          <TouchableOpacity
            onPress={handleCreateBoard}
            disabled={loading || !boardTitle.trim()}
            className={`px-2 py-2 min-h-[44px] justify-center ${
              boardTitle.trim() && !loading ? '' : 'opacity-50'
            }`}
          >
            <Text className="text-base text-blue-500 font-semibold">
              {loading ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Board Title */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Board Title</Text>
          <TextInput
            value={boardTitle}
            onChangeText={setBoardTitle}
            placeholder="Name your board"
            placeholderTextColor="#9ca3af"
            editable={!loading}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base min-h-[48px]"
          />
          <Text className="text-xs text-gray-500 mt-2">
            Give your board a clear, descriptive name
          </Text>
        </View>

        {/* Board Description */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Description (Optional)</Text>
          <TextInput
            value={boardDescription}
            onChangeText={setBoardDescription}
            placeholder="What is this board for?"
            placeholderTextColor="#9ca3af"
            editable={!loading}
            multiline
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base min-h-[100px]"
            textAlignVertical="top"
          />
        </View>

        {/* Color Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Board Color</Text>
          <View className="flex-row gap-3 flex-wrap">
            {colors.boardColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={{ backgroundColor: color }}
                className="w-16 h-16 rounded-lg border-2 border-gray-300"
              />
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <View className="flex-row gap-3">
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#3b82f6" />
            <Text className="text-sm text-blue-700 flex-1">
              Boards are collections of lists where you can organize your projects and tasks.
            </Text>
          </View>
        </View>

        {loading && (
          <View className="mt-8 items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
