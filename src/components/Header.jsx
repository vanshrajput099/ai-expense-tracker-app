import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'
import Link from 'next/link'
import { LayoutDashboard, PenBox } from 'lucide-react'
import colors from '@/colors'
import { checkUser } from '@/lib/checkUser'
import MenuHeader from './MenuHeader'

const Header = async () => {

    await checkUser();

    return (
        <header className='w-full p-5 z-50 sticky top-0' style={{ background: colors.surface }}>
            <nav className='flex justify-between'>
                <MenuHeader />
                <div className='max-lg:hidden'>
                    <Link href={"/"}>
                        <h1 style={{ color: colors.textPrimary }} className='text-2xl font-bold max-sm:text-xl'>Ai Expense Tracker</h1>
                    </Link>
                </div>
                <div className='flex items-center gap-5 max-lg:hidden'>
                    <SignedIn>
                        <Link href={"/dashboard"}>
                            <Button className={'text-white'} variant={"outline"} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }}>
                                <LayoutDashboard size={20} />
                                <span>DashBoard</span>
                            </Button>
                        </Link>

                        <Link href={"/transaction/create"}>
                            <Button variant={'outline'}>
                                <PenBox size={20} />
                                <span>Add Transaction</span>
                            </Button>
                        </Link>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl='/dashboard'>
                            <Button className={'text-white'} variant={'ghost'}>Log In</Button>
                        </SignInButton>
                        <SignUpButton >
                            <Button className={'text-white'} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }} variant={'ghost'}>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>

                </div>
            </nav>
        </header>
    )
}

export default Header
