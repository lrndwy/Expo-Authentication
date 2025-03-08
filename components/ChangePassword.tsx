import React, { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Lock, Eye, EyeOff } from 'lucide-react-native';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleChangePassword() {
    if (password !== confirmPassword) {
      Alert.alert(
        'Error',
        'Password tidak cocok'
      );
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      Alert.alert(
        'Success',
        'Password berhasil diubah'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Gagal mengubah password'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Text className="mb-1 text-typography-900">Password Baru</Text>
      <Input className="flex-row px-3 mb-3">
        <InputIcon as={Lock} size="sm" color="#6B7280"/>
        <InputField
          placeholder="Password Baru"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <InputSlot onPress={() => setShowPassword(!showPassword)}>
          <Icon as={showPassword ? Eye : EyeOff} size="sm" color="#6B7280"/>
        </InputSlot>
      </Input>

      <Text className="mb-1 text-typography-900">Konfirmasi Password</Text>
      <Input className="flex-row px-3 mb-5">
        <InputIcon as={Lock} size="sm" color="#6B7280"/>
        <InputField
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <InputSlot onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon as={showConfirmPassword ? Eye : EyeOff} size="sm" color="#6B7280"/>
        </InputSlot>
      </Input>

      <Button
        variant="solid"
        action="primary"
        onPress={handleChangePassword}
        isDisabled={loading}
      >
        <ButtonText>
          {loading ? 'Menyimpan...' : 'Ubah Password'}
        </ButtonText>
      </Button>
    </Box>
  );
} 