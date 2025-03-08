import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { AlertCircleIcon } from "@/components/ui/icon";
import { FormControlError, FormControlErrorText, FormControlErrorIcon, FormControlHelper, FormControlHelperText } from "@/components/ui/form-control";
import { Alert } from 'react-native';
import { useRefresh } from '@/hooks/useRefresh';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);

    const handleSignIn = async () => {
        if (!email) {
            setIsInvalidEmail(true);
            return;
        }
        if (password.length < 6) {
            setIsInvalidPassword(true);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
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
    };

    const { refreshing, onRefresh } = useRefresh(handleSignIn);

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
                    Login
                </Text>
                
                <FormControl isInvalid={isInvalidEmail}>
                    <FormControlLabel>
                        <FormControlLabelText>Email</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <InputSlot className="pl-2">
                            <Icon as={Mail} size="md" className="text-gray-500" />
                        </InputSlot>
                        <InputField
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setIsInvalidEmail(false);
                            }}
                            autoCapitalize="none"
                        />
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            Masukkan email yang valid
                        </FormControlHelperText>
                    </FormControlHelper>
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} />
                        <FormControlErrorText>
                            Email tidak boleh kosong
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>
                
                <FormControl isInvalid={isInvalidPassword}>
                    <FormControlLabel>
                        <FormControlLabelText>Password</FormControlLabelText>
                    </FormControlLabel>
                    <Input
                        variant="outline"
                        size="md"
                    >
                        <InputSlot className="pl-2">
                            <Icon as={Lock} size="md" className="text-gray-500" />
                        </InputSlot>
                        <InputField
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setIsInvalidPassword(false);
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <InputSlot className="pr-2" onPress={toggleShowPassword}>
                            <Icon as={showPassword ? Eye : EyeOff} size="md" className="text-gray-500" />
                        </InputSlot>
                    </Input>
                    <FormControlHelper>
                        <FormControlHelperText>
                            Password minimal 6 karakter
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
                    onPress={onRefresh}
                    disabled={refreshing || loading}
                    size="lg"
                >
                    <ButtonText>
                        {refreshing ? 'Loading...' : 'Sign In'}
                    </ButtonText>
                </Button>
            </VStack>
        </Box>
    );
} 