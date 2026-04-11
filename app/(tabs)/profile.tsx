import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useDataStore } from '../../store/useDataStore';
import { Avatar } from '../../components/Avatar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface SettingRowProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, label, onPress, danger }) => (
  <Pressable style={styles.settingRow} onPress={onPress}>
    <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={danger ? colors.danger : colors.primary}
      />
    </View>
    <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
    {!danger && (
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    )}
  </Pressable>
);

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { boards, cards } = useDataStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const stats = [
    { label: 'Boards', value: boards.length },
    { label: 'Cards', value: cards.length },
    { label: 'Teams', value: 1 },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Avatar + name section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar name={user?.name} size={88} />
            <View style={styles.editAvatarBtn}>
              <MaterialCommunityIcons name="camera" size={14} color="#fff" />
            </View>
          </View>
          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>ACCOUNT</Text>
          <SettingRow icon="account-outline" label="Edit Profile" onPress={() => {}} />
          <SettingRow icon="bell-outline" label="Notifications" onPress={() => router.push('/(tabs)/notifications')} />
          <SettingRow icon="shield-outline" label="Privacy" onPress={() => {}} />
          <SettingRow icon="information-outline" label="About" onPress={() => {}} />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>DEVELOPER</Text>
          <SettingRow icon="flask-outline" label="API Lab" onPress={() => router.push('/api-lab')} />
          <SettingRow icon="database-plus-outline" label="Seed Test Data" onPress={async () => {
            const { api } = await import('../../services/api');
            try {
              await api.testData.seed();
              const { fetchBoards } = useDataStore.getState();
              await fetchBoards();
              Alert.alert('Success', 'Test data seeded!');
            } catch {
              Alert.alert('Error', 'Could not seed test data. Is the backend running?');
            }
          }} />
        </View>

        <View style={styles.settingsSection}>
          <SettingRow icon="logout" label="Log out" onPress={handleLogout} danger />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  settingsSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsSectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingIconDanger: {
    backgroundColor: colors.dangerLight,
  },
  settingLabel: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  settingLabelDanger: {
    color: colors.danger,
  },
});
