import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import ChangePassword from '@/components/ChangePassword';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft } from 'lucide-react-native';

const PasswordScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1">
        <Box className="p-5 bg-background-50 border-b border-outline-200">
          <Box className="flex-row items-center gap-2">
            <Button
              variant="link"
              onPress={() => navigation.goBack()}
              className="mr-2"
            >
              <Icon as={ArrowLeft} size="md" color="#6B7280"/>
            </Button>
            <Text 
              size="2xl"
              className="font-bold text-typography-900"
            >
              Ubah Password
            </Text>
          </Box>
        </Box>
        
        <ScrollView>
          <VStack space="md" className="p-5">
            <ChangePassword />
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

export default PasswordScreen;