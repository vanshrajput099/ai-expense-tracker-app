"use client"
import colors from '@/colors'
import React from 'react'

const UserSaying = ({ data }) => {

    const createdAt = data.createdAt.toString().split(" ");
    const joinedString = createdAt[1] + " " + createdAt[2] + " " + createdAt[3];

    return (
        <div>
            <div style={{ border: `1px solid ${colors.border}`, background: colors.cardBase }} className='flex items-center gap-5 p-5 rounded-xl'>
                <img className='rounded-full h-15 w-15 object-cover' src={data.user.imageUrl} alt="" />
                <div style={{ color: colors.textSecondary }}>
                    <p>{data.testimonial}</p>
                    <p className='text-sm'>{joinedString}</p>
                </div>
            </div>
        </div>
    )
}

export default UserSaying