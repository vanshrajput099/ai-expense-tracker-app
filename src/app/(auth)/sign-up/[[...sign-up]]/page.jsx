import { SignUp } from '@clerk/nextjs'
import React from 'react'
import { dark } from "@clerk/themes";

const page = () => {
    return (
        <div>
            <SignUp appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: '#3B82F6',
                    colorBackground: '#0D0D0D',
                    colorText: '#F3F4F6',
                    colorTextSecondary: '#A1A1AA',
                    colorInputBackground: '#1A1A1A',
                    colorInputText: '#E5E7EB',
                    colorInputBorder: '#2A2A2A',
                    colorDanger: '#EF4444',
                },
                elements: {
                    card: 'shadow-lg rounded-xl',
                    formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white rounded-lg',
                    footerActionText: 'text-gray-400',
                }
            }} />
        </div>
    )
}

export default page
