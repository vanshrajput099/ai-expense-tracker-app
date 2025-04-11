import React from 'react'
import colors from '@/colors'

const Features = ({ data }) => {
    return (
        <div style={{ background: colors.cardBase, border: `1px solid ${colors.border}` }} className='w-1/3 rounded-xl p-10 text-center flex flex-col items-center justify-center gap-5'>
            <h1 className='font-bold text-3xl' style={{ color: colors.textPrimary }}>{Object.keys(data)[0]}</h1>
            <p style={{ color: colors.textSecondary }}>{data[Object.keys(data)[0]]}</p>
        </div>
    )
}

export default Features