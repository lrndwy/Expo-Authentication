import React, { useState, useEffect } from 'react';
import { Alert, Platform, ScrollView, RefreshControl } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/icon';
import { LogOut, Camera, User, UserCircle, Lock, ArrowRight } from 'lucide-react-native';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';
import { useNavigation } from '@react-navigation/native';
import { Divider } from '@/components/ui/divider';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { HStack } from "@/components/ui/hstack";
import { useRefresh } from '@/hooks/useRefresh';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
}

type RootStackParamList = {
  Password: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Account = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    avatar_url: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const { refreshing, onRefresh } = useRefresh(async () => {
    await getProfile();
  });

  useEffect(() => {
    getProfile();
    onRefresh();
  }, []);

  useEffect(() => {
    if (profile.avatar_url) {
      downloadImage(profile.avatar_url);
    }
  }, [profile.avatar_url]);

  const downloadImage = async (path: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);

      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setLoading(false)
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data profil');
    } finally {
      setLoading(false)
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            updated_at: new Date(),
          });

        if (error) throw error;
        Alert.alert('Sukses', 'Profil berhasil diperbarui');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      setUploading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Maaf', 'Kami membutuhkan izin untuk mengakses galeri foto');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const image = result.assets[0];
          const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
          
          const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
          const filePath = `${user.id}-${Date.now()}.${fileExt}`;

          const { data, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, arraybuffer, {
              contentType: `image/${fileExt}`,
              upsert: true
            });

          if (uploadError) throw uploadError;

          setProfile({ ...profile, avatar_url: filePath });
        }
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat logout');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="flex-1">
        <Box className="p-5 bg-background-50 border-b border-outline-200">
          <Text 
            size="2xl"
            className="font-bold text-typography-900"
          >
            Akun Saya
          </Text>
        </Box>
        
        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
            />
          }
        >
          <VStack space="md" className="p-5 gap-2 flex-col">
            <Box className="items-center">
              <Box className="flex-col gap-4">
                {loading || uploading ? (
                  <VStack space="md" className="items-center">
                    <Skeleton
                      variant="circular"
                      className="w-32 h-32"
                    />
                    <VStack space="sm" className="items-center w-full">
                      <SkeletonText className="h-7 w-40" />
                      <SkeletonText className="h-5 w-24" />
                    </VStack>
                  </VStack>
                ) : (
                  <>
                    <VStack space="xs" className="items-center mt-2">
                      <Avatar size="2xl" className="border-2">
                        {avatarUrl ? (
                          <AvatarImage 
                            source={{ uri: avatarUrl }}
                            alt="Profile"
                          />
                        ) : (
                          <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
                        )}
                      </Avatar>
                      <Text 
                        size="xl"
                        className="font-bold text-typography-900"
                      >
                        {profile.full_name}
                      </Text>
                      <Text
                        size="sm" 
                        className="text-typography-500"
                      >
                        @{profile.username}
                      </Text>
                    </VStack>
                  </>
                )}
              </Box>
            </Box>
          </VStack>

          {loading ? (
            <VStack space="md" className="px-5">
              <Box className="flex-col gap-2">
                <Skeleton className="h-14 rounded-md" />
                <Skeleton className="h-14 rounded-md" />
              </Box>
              <Box className="p-5 mt-2">
                <Skeleton className="h-12 rounded-md" />
              </Box>
            </VStack>
          ) : (
            <VStack space="md" className="mt-5">
              <Box className="flex-col gap-2">
                <Button
                  size="xl"
                  onPress={() => navigation.navigate('Profile')}
                  className="justify-start bg-transparent rounded-none data-[active=true]:bg-transparant"
                >
                  <Icon as={User} size="md" color="#6B7280" />
                  <ButtonText className="flex-1 text-left ml-3 text-gray-800 data-[active=true]:text-gray-800">Profil Akun</ButtonText>
                  <Icon as={ArrowRight} size="md" color="#6B7280" />
                </Button>
                <Divider className="my-0.5" />
                <Button
                  size="xl"
                  onPress={() => navigation.navigate('Password')}
                  className="justify-start bg-transparent rounded-none data-[active=true]:bg-transparant"
                >
                  <Icon as={Lock} size="md" color="#6B7280" />
                  <ButtonText className="flex-1 text-left ml-3 text-gray-800 data-[active=true]:text-gray-800">Ubah Password</ButtonText>
                  <Icon as={ArrowRight} size="md" color="#6B7280" />
                </Button>
              </Box>
              <Box className="p-5 mt-2">
                <Button 
                  variant="outline"
                  action="primary"
                  onPress={handleLogout}
                  size="lg"
                >
                  <Icon as={LogOut} size="md" color="black" />
                  <ButtonText>Logout</ButtonText>
                </Button>
              </Box>
            </VStack>
          )}
          
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

export default Account; 