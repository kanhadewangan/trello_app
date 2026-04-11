import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { api } from '../services/api';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.users.create({ name: trimmedName, email: trimmedEmail, password });
      router.replace('/');
    } catch (e) {
      if (e instanceof Error) {
        try {
          const parsed = JSON.parse(e.message);
          setError(parsed?.message || e.message);
        } catch { setError(e.message); }
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.logoSection}>
            <View style={styles.logoMark}>
              <View style={[styles.logoBar, styles.logoBarLeft]} />
              <View style={[styles.logoBar, styles.logoBarRight]} />
            </View>
            <Text style={styles.logoText}>Trello</Text>
            <Text style={styles.tagline}>Create your account</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.form}>

            {/* Name */}
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.textDisabled}
                value={name} onChangeText={setName} autoCapitalize="words" />
            </View>

            {/* Email */}
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor={colors.textDisabled}
                value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            {/* Password */}
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={colors.textDisabled}
                value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
              <Pressable onPress={() => setShowPass(!showPass)} hitSlop={8}>
                <MaterialCommunityIcons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Confirm Password */}
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-check-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={colors.textDisabled}
                value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPass} />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Sign up button */}
            <Pressable style={[styles.signupBtn, isLoading && { opacity: 0.7 }]} onPress={handleSignup} disabled={isLoading}>
              <Text style={styles.signupBtnText}>{isLoading ? 'Creating account…' : 'Create account'}</Text>
            </Pressable>

            {/* Back to login */}
            <Pressable onPress={() => router.replace('/')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.loginLinkAccent}>Log in</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing['3xl'] },
  logoSection: { alignItems: 'center', marginBottom: spacing['2xl'] },
  logoMark: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, height: 32 },
  logoBar: { width: 11, backgroundColor: colors.primary, borderRadius: 2 },
  logoBarLeft: { height: 32, marginRight: 4 },
  logoBarRight: { height: 22 },
  logoText: { fontSize: 32, fontWeight: typography.fontWeight.bold, color: colors.primary, letterSpacing: -1, marginBottom: 4 },
  tagline: { fontSize: typography.fontSize.base, color: colors.textSecondary },
  form: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xl, borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  fieldLabel: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: spacing.xs, marginTop: spacing.md },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: typography.fontSize.base, color: colors.textPrimary },
  errorText: { fontSize: typography.fontSize.sm, color: colors.danger, marginTop: spacing.sm },
  signupBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.lg,
  },
  signupBtnText: { color: colors.textInverse, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold },
  loginLink: { alignItems: 'center', marginTop: spacing.lg },
  loginLinkText: { fontSize: typography.fontSize.base, color: colors.textSecondary },
  loginLinkAccent: { color: colors.primary, fontWeight: typography.fontWeight.semibold },
});
