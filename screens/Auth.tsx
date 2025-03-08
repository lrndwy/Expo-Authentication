import React, { useState } from 'react'
import { AppState } from 'react-native'
import { supabase } from '@/lib/supabase'
import Login from '@/components/Login'
import Register from '@/components/Register'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { SafeAreaView } from 'react-native-safe-area-context'

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Box className="flex-1 p-5 w-full max-w-[400px] self-center items-center justify-center">
                {isLogin ? <Login /> : <Register />}
                <Button 
                    variant="link"
                    onPress={() => setIsLogin(!isLogin)}
                    className="mt-5"
                >
                    <ButtonText className="underline">
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </ButtonText>
                </Button>
            </Box>
        </SafeAreaView>
    )
}
