import React from 'react'
import UserSaying from './UserSaying'
import { getTestimonials } from '@/app/actions/testimonial';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from './ui/button';
import TestimonialDrawer from './TestimonialDrawer';
import colors from '@/colors';

const Testimonial = async () => {

    const testimonials = await getTestimonials();

    return (
        <div className="w-full flex flex-col items-center justify-center py-20">
            <div className="w-3/4 gap-10 flex flex-col justify-center items-center">
                <h1 style={{ color: colors.textPrimary }} className='font-bold text-4xl text-center'>What Users Are Saying ?</h1>
                <div className='flex w-full justify-center gap-10'>
                    {
                        testimonials.data.length === 0 ?
                            <>
                                <p className='text-white'>No Testimonials Yet...</p>
                            </>
                            :
                            testimonials.data.map((data, idx) => {
                                return <UserSaying key={idx} data={data} />
                            })
                    }
                </div>
                <SignedIn>
                    <TestimonialDrawer>
                        <Button>
                            Write Your Testimonial
                        </Button>
                    </TestimonialDrawer>
                </SignedIn>

                <SignedOut>
                    <h1>Sign In to Write Your Testimonial.</h1>
                </SignedOut>

            </div>
        </div>
    )
}

export default Testimonial