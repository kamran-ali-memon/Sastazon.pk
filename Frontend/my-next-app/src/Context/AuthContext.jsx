
'use client'

import { createContext, useEffect, useState } from 'react'
import api from '../Utils/Api.js'


export const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => {},
    logout: () => {}
})


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)


    // Check logged-in user when website opens
    useEffect(() => {

        const checkUser = async () => {

            try {

                const response = await api.get(
                    '/api/auth/me'
                )

                if (response.data?.user) {
                    setUser(response.data.user)
                }

            } catch (error) {

                setUser(null)

            } finally {

                setLoading(false)

            }
        }


        checkUser()

    }, [])


    // Called after successful login
    function login(userData) {

        setUser(userData)

    }


    // Logout user
    async function logout() {

        try {

            await api.post('/api/auth/logout')

        } catch (error) {

            console.log('Logout Error:', error)

        } finally {

            setUser(null)
        }
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
