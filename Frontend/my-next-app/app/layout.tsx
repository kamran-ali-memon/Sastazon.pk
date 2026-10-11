import './globals.css'

import { Toaster } from 'react-hot-toast'

import { AuthProvider } from '../src/Context/AuthContext'
import { CartProvider } from '../src/Context/CartContext'


export default function RootLayout({ children }: any) {

    return (

        <html lang="en">

            <body>

                <AuthProvider>

                    <CartProvider>

                        {children}

                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#151515',
                                    color: '#ffffff',
                                    border: '1px solid #e85d04',
                                    padding: '18px 24px',
                                    fontSize: '16px',
                                    minWidth: '320px',
                                    maxWidth: '90vw',
                                    borderRadius: '12px',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#e85d04',
                                        secondary: '#ffffff',
                                    },
                                },
                            }}
                        />


                    </CartProvider>

                </AuthProvider>

            </body>

        </html>

    )

}
