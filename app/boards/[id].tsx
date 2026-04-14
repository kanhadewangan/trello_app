import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDataStore } from '../../store/useDataStore';
import { colors } from '../../theme/colors';

export default function BoardSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { boards, fetchBoards } = useDataStore();
  const [editing, setEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const board = boards.find((b) => b.id === id);

  React.useEffect(() => {
    if (board && !editing) {
      setBoardTitle(board.title);
    }
  }, [board, editing]);

  const handleDeleteBoard = () => {
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${board?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // Implement delete functionality when backend is ready
              Alert.alert('Success', 'Board deleted');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete board');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!board) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="px-2 py-2 min-h-[44px] justify-center"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Board Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Board Preview */}
        <View
          style={{ backgroundColor: board.color }}
          className="h-32 rounded-lg mb-6 p-4 flex items-start justify-end"
        >
          <Text className="text-white text-2xl font-bold">{board.title}</Text>
        </View>

        {/* Board Info Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Board Information</Text>

          {/* Title Field */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-medium text-gray-700">Title</Text>
              {!editing && (
                <TouchableOpacity
                  onPress={() => setEditing(true)}
                  className="px-3 py-1 rounded"
                >
                  <Text className="text-blue-500 font-semibold">Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {editing ? (
              <View className="gap-3">
                <TextInput
                  value={boardTitle}
                  onChangeText={setBoardTitle}
                  placeholder="Board title"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                />
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => {
                      setEditing(false);
                      setBoardTitle(board.title);
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 items-center min-h-[44px] justify-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditing(false)}
                    className="flex-1 bg-blue-500 rounded-lg px-4 py-3 items-center min-h-[44px] justify-center"
                  >
                    <Text className="text-white font-semibold">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text className="text-base text-gray-700 bg-gray-50 px-4 py-3 rounded-lg">
                {board.title}
              </Text>
            )}
          </View>

          {/* Color Field */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-3">Color</Text>
            <View
              style={{ backgroundColor: board.color }}
              className="h-20 rounded-lg border-2 border-gray-300"
            />
          </View>

          {/* Stats Section */}
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-base font-medium text-gray-700 mb-3">Stats</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-600 text-sm">Lists</Text>
                <Text className="text-2xl font-bold text-gray-900">-</Text>
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Cards</Text>
                <Text className="text-2xl font-bold text-gray-900">{board.cardCount || 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="border-t-2 border-red-200 pt-6">
          <Text className="text-lg font-semibold text-red-600 mb-4">Danger Zone</Text>
          <TouchableOpacity
            onPress={handleDeleteBoard}
            disabled={loading}
            className="bg-red-50 border-2 border-red-200 rounded-lg px-4 py-4 items-center min-h-[44px] justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#dc2626" size="small" />
            ) : (
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#dc2626" />
                <Text className="text-red-600 font-semibold">Delete Board</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-xs text-gray-500 mt-2 text-center">
            This action cannot be undone. All lists and cards will be permanently deleted.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
