"use client";
import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { LayoutDashboard, MenuIcon, PenBox } from 'lucide-react';
import colors from '@/colors';
import Link from 'next/link';
import { Button } from './ui/button';

const MenuHeader = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className='lg:hidden flex gap-5'>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <MenuIcon onClick={() => { setOpen(true) }} className='text-white' />
                </SheetTrigger>
                <SheetContent side={'left'}>    

                    <div className='h-full' style={{ backgroundColor: colors.background }}>
                        <SignedIn>
                            <div className='w-full'>
                                <div className='w-full flex justify-center p-5'>
                                    <Link href={"/dashboard"} className='w-full'>
                                        <Button onClick={() => { setOpen(false) }} className={'text-white w-full'} variant={"outline"} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }}>
                                            <LayoutDashboard size={20} />
                                            <span>DashBoard</span>
                                        </Button>
                                    </Link>
                                </div>

                                <div className='w-full flex justify-center p-5'>
                                    <Link href={"/transaction/create"} className='w-full'>
                                        <Button className={'w-full'} onClick={() => { setOpen(false) }} variant={'outline'}>
                                            <PenBox size={20} />
                                            <span>Add Transaction</span>
                                        </Button>
                                    </Link>
                                </div>

                                <div className='w-full flex flex-col items-center p-5'>
                                    <UserButton />
                                    <p className='text-white'>Logout</p>
                                </div>
                            </div>
                        </SignedIn>


                        <SignedOut>
                            <h1 className='text-white text-2xl font-bold text-center py-10'>Log-in Your Account</h1>
                            <div className='w-full flex justify-center p-5'>
                                <SignInButton forceRedirectUrl='/dashboard'>
                                    <Button onClick={() => { setOpen(false) }} className={'text-black w-full'} variant={'outline'}>Log In</Button>
                                </SignInButton>
                            </div>
                            <div className='w-full flex justify-center p-5'>
                                <SignUpButton >
                                    <Button onClick={() => { setOpen(false) }} className={'text-white w-full'} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }} variant={'ghost'}>Sign Up</Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </SheetContent>
            </Sheet>
            <Link href={"/"}>
                <h1 style={{ color: colors.textPrimary }} className='text-2xl font-bold max-sm:text-xl'>Ai Expense Tracker</h1>
            </Link>
        </div >
    )
}

export default MenuHeader