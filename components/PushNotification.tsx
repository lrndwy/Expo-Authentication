import React, { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function PushNotification() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        saveTokenToDatabase(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Handle notifikasi yang diterima saat aplikasi berjalan
      console.log('Notifikasi diterima:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle ketika user mengklik notifikasi
      console.log('Respon notifikasi:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const saveTokenToDatabase = async (token: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('push_tokens')
          .upsert({
            user_id: user.id,
            token: token,
            created_at: new Date(),
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error menyimpan token:', error);
    }
  };

  return null;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Gagal mendapatkan token push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '348cb92d-81ee-4014-aaa5-2495835d1394' // dari app.json
    })).data;
  } else {
    alert('Harus menggunakan perangkat fisik untuk push notifications');
  }

  return token;
}