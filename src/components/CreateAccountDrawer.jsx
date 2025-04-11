"use client";
import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { accountSchema } from '@/lib/schema';
import { Input } from "@/components/ui/input"
import useFetch from '@/hooks/useFetch';
import { createAccount } from '@/app/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox"

const CreateAccountDrawer = ({ children }) => {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: '', type: 'CURRENT', balance: '', isDefault: false
        }
    });

    const { data, error, fn, loading } = useFetch(createAccount);

    useEffect(() => {
        if (data && !loading) {
            toast.success("Account Created Successfully !!");
            reset();
            setOpen(false);
        }
    }, [loading, data])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account");
        }
    }, [error])

    const onSubmit = async (data) => {
        await fn(data);
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Enter Your Account Details</DrawerTitle>
                </DrawerHeader>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 px-5 pb-5 '>
                        <div className='flex flex-col gap-3'>
                            <label htmlFor="name">Name</label>
                            <Input id="name" placeholder="Account Name" {...register("name")} />
                            {
                                errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>
                            }
                        </div>

                        <div className='flex flex-col gap-3'>
                            <label htmlFor="type">Account Type</label>
                            <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Account Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">Current</SelectItem>
                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                </SelectContent>
                            </Select>
                            {
                                errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>
                            }
                        </div>

                        <div className='flex flex-col gap-3'>
                            <label htmlFor="balance">Initial Balance</label>
                            <Input id="balance" type={'number'} placeholder="Enter your initial balance" {...register("balance")} />
                            {
                                errors.balance && <p className='text-sm text-red-500'>{errors.balance.message}</p>
                            }
                        </div>

                        <div className='flex justify-between border rounded-lg items-center p-2'>
                            <div>
                                <label htmlFor="isDefault" className='mt-2'>Set As Default Account</label>
                                <p className='font-light'>This account will be selected as default account for transactions.</p>
                            </div>
                            <Switch id="isDefault"
                                onCheckedChange={(checked) => setValue("isDefault", checked)}
                                checked={watch("isDefault")}
                            />
                        </div>

                        <div className='flex gap-2 justify-between items-center'>
                            <DrawerClose asChild>
                                <Button className={'w-1/2'} type="button" variant={'outline'} >Cancel</Button>
                            </DrawerClose>
                            <Button className={'w-1/2'} type="submit" disabled={loading} >
                                {loading ?
                                    <>
                                        <Loader2 className='animate-spin' /> Creating...
                                    </> : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer
