import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isHydrated, isAuthenticated]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center p-8">
      <View className="items-center mb-12">
        <Text className="text-4xl text-fuchsia-500 font-black mb-2" style={styles.neonText}>VIBE CHECK</Text>
        <Text className="text-zinc-500 font-medium tracking-widest uppercase">Enter the Matrix</Text>
      </View>
      <View className="w-full">
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
        {error ? <Text className="text-red-500 mt-1 text-sm">{error}</Text> : null}
        <View className="mt-8" />
        <Button title="ENTER" onPress={handleLogin} isLoading={isLoading} />
        <Pressable onPress={() => router.push('/signup')} className="mt-6 items-center">
          <Text className="text-zinc-400">No account yet? <Text className="text-cyan-400">Sign up</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  neonText: {
    textShadowColor: '#d946ef',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  }
});
