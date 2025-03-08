import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AppNavigator from './navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import PushNotification from '@/components/PushNotification';

// Konfigurasi handler notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <PushNotification />
      <AppNavigator />
      <StatusBar 
        backgroundColor="#f6f6f6"
      />
    </GluestackUIProvider>
  );
}
