import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import * as Notifications from 'expo-notifications';

const Home = () => {
  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notifikasi Baru! 📬",
          body: "Ini adalah contoh notifikasi dari aplikasi kita",
          data: { data: 'Ini adalah data tambahan' },
        },
        trigger: null, // null berarti notifikasi akan langsung muncul
      });
    } catch (error) {
      console.error('Error mengirim notifikasi:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1">
        <Box className="p-5 bg-background-50 border-b border-outline-200">
          <Box className="flex-row items-center gap-2">
            <Text 
              size="2xl"
              className="font-bold text-typography-900"
            >
              Selamat Datang
            </Text>
          </Box>
        </Box>
        
        <VStack 
          space="md" 
          className="flex-1 items-center justify-center p-5"
        >
          <Text 
            size="md"
            className="text-center text-typography-600"
          >
            Ini adalah halaman utama aplikasi
          </Text>

          <Button
            variant="solid"
            action="primary"
            onPress={sendNotification}
            size="lg"
            className="mt-4"
          >
            <ButtonText>
              Kirim Notifikasi
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default Home;
