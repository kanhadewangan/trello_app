import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useDataStore } from '../../store/useDataStore';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createGroup } = useDataStore();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      await createGroup(groupName);
      Alert.alert('Success', 'Group created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="px-2 py-2 min-h-[44px] justify-center">
            <Text className="text-base text-blue-500">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold">Create Group</Text>
          <TouchableOpacity
            onPress={handleCreateGroup}
            disabled={loading || !groupName.trim()}
            className={`px-2 py-2 min-h-[44px] justify-center ${groupName.trim() && !loading ? '' : 'opacity-50'}`}
          >
            <Text className="text-base text-blue-500 font-semibold">
              {loading ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 py-6">
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Group Name</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor="#9ca3af"
            editable={!loading}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base min-h-[48px]"
          />
        </View>

        <View className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-sm text-blue-700">
            💡 You can invite members after creating the group.
          </Text>
        </View>

        {loading && (
          <View className="mt-6 items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}
      </View>
    </View>
  );
}
