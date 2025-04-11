"use client"

import React, { useEffect, useRef } from 'react'
import colors from '@/colors'
import aiImage from "@/assets/ai.jpg"
import Image from 'next/image'

const Banner = () => {

    return (
        <div className='w-full flex flex-col justify-center items-center mt-20 gap-5'>
            <div className='w-2/3 text-center'>
                <h1 style={{ color: colors.textPrimary }} className='text-5xl'>Welcome To</h1>
                <h1 style={{ color: colors.textPrimary }} className='text-6xl font-bold mt-3'>AI Expense Tracker</h1>
                <p style={{ color: colors.textSecondary }} className='text-xl mt-5 tracking-wider leading-normal'>Managing finances just got smarter! Our AI-powered expense tracker helps you monitor income, track expenses, and set savings goals with ease. With advanced security measures, real-time insights, and automated reminders, you stay in control of your finances effortlessly. Let AI analyze your spending habits and provide smart recommendations to optimize your budget. Secure, intelligent, and user-friendly—your ultimate financial companion!</p>
            </div>
            <Image alt={'ai.png'} src={aiImage} className='rounded-2xl' />
        </div>
    )
}

export default Banner
