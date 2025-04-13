"use client"
import colors from '@/colors'
import React from 'react'

const UserSaying = ({ data }) => {
    return (
        <div>
            <div style={{ border: `1px solid ${colors.border}`, background: colors.cardBase }} className='flex items-center gap-5 p-5 rounded-xl'>
                <img className='rounded-full h-15 w-15 object-cover' src={data.user.imageUrl} alt="" />
                <p className='' style={{ color: colors.textSecondary }}>{data.testimonial}</p>
            </div>
        </div>
    )
}

export default UserSaying