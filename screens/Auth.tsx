import React, { useState } from 'react'
import { StyleSheet, View, AppState, TouchableOpacity, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import Login from '../components/Login'
import Register from '../components/Register'

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
        <View style={styles.container}>
            {isLogin ? <Login /> : <Register />}
            <TouchableOpacity 
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
            >
                <Text style={styles.switchText}>
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchButton: {
        marginTop: 20,
    },
    switchText: {
        color: '#000',
        textDecorationLine: 'underline',
    },
})
