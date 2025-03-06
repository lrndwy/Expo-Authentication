import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import Auth from '../screens/Auth';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Mengecek session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Subscribe ke perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // Jika tidak ada session (belum login)
          <Stack.Screen name="Auth" component={Auth} />
        ) : (
          // Jika sudah login
          <Stack.Screen name="Home" component={Home} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 