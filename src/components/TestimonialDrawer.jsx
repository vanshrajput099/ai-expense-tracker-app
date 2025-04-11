"use client";
import React, { useEffect, useState } from 'react'
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
import { Button } from './ui/button'
import { Input } from './ui/input'
import colors from '@/colors'
import useFetch from '@/hooks/useFetch';
import { createTestimonial } from '@/app/actions/testimonial';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TestimonialDrawer = ({ children }) => {

    const [testimonial, setTestimonial] = useState("");
    const [error, setError] = useState(null);

    const { loading, fn, data, error: err } = useFetch(createTestimonial);

    const onSubmit = async () => {
        if (testimonial.trim() === "") {
            setError("Enter the review");
            return;
        }

        if (testimonial.length < 10) {
            setError("Review length should be more than 10 Characters");
            return;
        }

        await fn(testimonial);
    }

    useEffect(() => {
        if (data) {
            toast.success("Review Added Successfully !!");
            setError(null);
        }
    }, [data, loading])

    useEffect(() => {
        if (err) {
            toast.error(err.error || "There was a problem while adding your review");
            setError(err.error);
        }
    }, [err])

    return (
        <Drawer onClose={() => { setError(null) }}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent style={{ background: colors.surface }} className={'text-white border-none'}>
                <div className='flex flex-col items-center gap-5 py-5'>
                    <div className='w-full px-20'>
                        <Input onChange={(e) => { setTestimonial(e.target.value); setError(null) }} type={'text'} placeholder={'Write Your Testimonial'} />
                        {error && <p className='text-red-500 mt-2'>*{error}</p>}
                    </div>
                    <div className='flex w-full gap-5 px-20'>
                        <Button onClick={onSubmit} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }} disabled={loading} className={'w-1/2 text-white'} variant="outline">
                            {
                                loading ?
                                    <><Loader2 className='animate-spin' /> Creating</>
                                    :
                                    "Submit"
                            }
                        </Button>
                        <DrawerClose className={'w-1/2'}>
                            <Button className={'w-full text-black'} variant="outline">Cancel</Button>
                        </DrawerClose>
                    </div>
                </div>
            </DrawerContent>
        </Drawer >
    )
}

export default TestimonialDrawer