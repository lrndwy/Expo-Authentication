import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <AppNavigator />
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
