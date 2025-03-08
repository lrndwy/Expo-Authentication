import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { AlertCircleIcon, InfoIcon } from "@/components/ui/icon";
import { Alert } from 'react-native';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

    async function signUpWithEmail() {
        // Validasi email dan password
        if (!email || !email.includes('@')) {
            setIsEmailInvalid(true);
            return;
        }
        if (password.length < 6) {
            setIsPasswordInvalid(true);
            return;
        }

        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert(
                'Error',
                error.message
            );
            return;
        }
        
        if (!session) {
            Alert.alert(
                'Success',
                'Silakan cek email Anda untuk verifikasi akun'
            );
            return;
        }
        setLoading(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box className="p-5 w-full">
            <VStack space="md">
                <Text 
                    size="2xl" 
                    className="text-center font-bold mb-5"
                >
                    Register
                </Text>
                
                <FormControl isInvalid={isEmailInvalid}>
                    <FormControlLabel>
                        <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <InputSlot className="pl-2">
                            <Icon as={Mail} size="md" className="text-gray-500"/>
                        </InputSlot>
                        <InputField
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setIsEmailInvalid(false);
                            }}
                            autoCapitalize="none"
                        />
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            Masukkan alamat email yang valid
                        </FormControlHelperText>
                    </FormControlHelper>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            Email tidak valid
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>
                
                <FormControl isInvalid={isPasswordInvalid}>
                    <FormControlLabel>
                        <FormControlLabelText>Password</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <InputSlot className="pl-2">
                            <Icon as={Lock} size="md" className="text-gray-500"/>
                        </InputSlot>
                        <InputField
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setIsPasswordInvalid(false);
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <InputSlot className="pr-2" onPress={toggleShowPassword}>
                            <Icon as={showPassword ? Eye : EyeOff} size="md" className="text-gray-500"/>
                        </InputSlot>
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            Minimal 6 karakter
                        </FormControlHelperText>
                    </FormControlHelper>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            Password harus minimal 6 karakter
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>
                
                <Button 
                    variant="solid"
                    action="primary"
                    onPress={signUpWithEmail}
                    disabled={loading}
                    size="lg"
                >
                    <ButtonText>
                        {loading ? 'Loading...' : 'Sign Up'}
                    </ButtonText>
                </Button>
            </VStack>
        </Box>
    );
} 