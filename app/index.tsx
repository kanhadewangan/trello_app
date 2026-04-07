import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({ id: '1', name: 'GenZ Coder', email });
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
        <View className="mt-8" />
        <Button title="ENTER" onPress={handleLogin} isLoading={isLoading} />
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
