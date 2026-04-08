import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      await api.users.create({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      router.replace('/');
    } catch (signupError) {
      if (signupError instanceof Error) {
        try {
          const parsed = JSON.parse(signupError.message);
          setError(parsed?.message || signupError.message);
        } catch {
          setError(signupError.message);
        }
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center p-8">
      <View className="items-center mb-12">
        <Text className="text-4xl text-cyan-400 font-black mb-2" style={styles.neonText}>CREATE ID</Text>
        <Text className="text-zinc-500 font-medium tracking-widest uppercase">Join the Matrix</Text>
      </View>

      <View className="w-full">
        <Input
          label="Name"
          placeholder="your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          label="Password"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {error ? <Text className="text-red-500 mt-1 text-sm">{error}</Text> : null}

        <View className="mt-8" />
        <Button title="SIGN UP" onPress={handleSignup} isLoading={isLoading} />

        <Pressable onPress={() => router.replace('/')} className="mt-6 items-center">
          <Text className="text-zinc-400">Already have an account? <Text className="text-fuchsia-500">Back to login</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  neonText: {
    textShadowColor: '#22d3ee',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
