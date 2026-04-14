import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';

export default function GroupsScreen() {
  const { groups, fetchGroups, isLoading, deleteGroup } = useDataStore();
  const { isAuthenticated } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadGroups();
    }
  }, [isAuthenticated]);

  const loadGroups = async () => {
    setRefreshing(true);
    try {
      await fetchGroups();
    } catch (error) {
      Alert.alert('Error', 'Failed to load groups');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(groupId);
              Alert.alert('Success', 'Group deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Please log in to view groups</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-4 pb-4 flex-row items-center justify-between border-b border-gray-200">
        <Text className="text-2xl font-bold">Groups</Text>
        <TouchableOpacity
          onPress={() => router.push('/groups/create' as any)}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadGroups} />
        }
      >
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : groups.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-lg">No groups yet</Text>
            <TouchableOpacity
              onPress={() => router.push('/groups/create' as any)}
              className="mt-4 bg-blue-500 px-6 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Create Your First Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                onPress={() => router.push(`/groups/${group.id}` as any)}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {group.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      Members: {(group.members?.length || 0)} + Invited: {(group.invitedMembers?.length || 0)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteGroup(group.id, group.name)}
                    className="ml-2 p-2"
                  >
                    <Text className="text-red-500 font-semibold">Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
