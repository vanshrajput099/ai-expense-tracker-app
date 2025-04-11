import colors from '@/colors'
import React from 'react'
import { Mail } from 'lucide-react';
import { Github } from 'lucide-react';

const Footer = () => {
    return (
        <div className='w-full mt-10 py-5 gap-5 flex flex-col justify-center items-center' style={{ borderTop: `1px solid ${colors.border}`, background: colors.surface }}>
            <div className='w-2/3 flex items-center justify-center'>
                <div className='flex gap-5'>
                    <div className='text-white flex gap-2'>
                        <a href="mailto:vanshrajput099@gmail.com" target="_blank">
                            <Mail />
                        </a>
                    </div>
                    <div className='text-white flex gap-2'>
                        <a href="https://github.com/vanshrajput099" target="_blank">
                            <Github />
                        </a>
                    </div>
                </div>
            </div>
            <h1 style={{ color: colors.textPrimary }}>- Made By Vansh Rajput -</h1>
        </div>
    )
}

export default Footer