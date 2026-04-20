import React, { useState, useEffect } from 'react';
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
import { useDataStore } from '../../store/useDataStore';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const { groups, inviteMemberToGroup, removeGroupMember } = useDataStore();
  const [group, setGroup] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && groups) {
      const found = groups.find((g) => g.id === id);
      setGroup(found);
    }
  }, [id, groups]);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }

    setLoading(true);
    try {
      // Note: The API expects userId, but we're using email as placeholder
      // In production, you'd need to convert email to userId first
      await inviteMemberToGroup(id as string, inviteEmail);
      Alert.alert('Success', 'Invitation sent successfully');
      setInviteEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeGroupMember(id as string, memberId);
              Alert.alert('Success', 'Member removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  if (!group) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xl">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold">{group.name}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Invite Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Invite Members</Text>
          <View className="flex-col gap-3">
            <TextInput
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="Enter user ID to invite"
              placeholderTextColor="#9ca3af"
              editable={!loading}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
            />
            <TouchableOpacity
              onPress={handleInviteMember}
              disabled={loading || !inviteEmail.trim()}
              className={`bg-blue-500 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center ${
                loading || !inviteEmail.trim() ? 'opacity-50' : ''
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-base">Send Invite</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Members Section */}
     {group.members.map((member: { id: string; name: string; email: string }, index: number) => (
  <View
    key={member.id}  // 👈 use id as key, not index
    className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
  >
    <View>
      <Text className="text-gray-900 font-medium">{member.name}</Text>   {/* 👈 use .name */}
      <Text className="text-gray-500 text-sm">{member.email}</Text>       {/* 👈 use .email */}
    </View>
    <TouchableOpacity
      onPress={() => handleRemoveMember(member.id, member.name)}  
      className="bg-red-50 px-3 py-2 rounded min-w-[60px] items-center"
    >
      <Text className="text-red-600 text-sm font-semibold">Remove</Text>
    </TouchableOpacity>
  </View>
))}

        {/* Invited Members Section */}
        {group.invitedMembers && group.invitedMembers.length > 0 && (
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Pending Invitations ({group.invitedMembers.length})
            </Text>
            <View className="gap-2">
              {group.invitedMembers.map((invited: string, index: number) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                >
                  <View>
                    <Text className="text-gray-900">{invited}</Text>
                    <Text className="text-sm text-yellow-700 mt-1">Pending</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
