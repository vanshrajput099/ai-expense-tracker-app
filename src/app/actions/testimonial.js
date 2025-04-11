"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export const getTestimonials = async () => {
    try {
        const topTestimonials = await db.testimonial.findMany({
            take: 2,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        });

        return { success: true, data: topTestimonials };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export const createTestimonial = async (testimonial) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });

        if (!user) {
            throw new Error("User Doesnot Exist");
        }

        const newTestimonial = await db.testimonial.upsert({
            where: {
                userId: user.id
            },
            update: {
                testimonial: testimonial
            },
            create: {
                userId: user.id,
                testimonial: testimonial
            }
        });

        if (!newTestimonial) {
            throw new Error("Internal Server Error !!");
        }

        revalidatePath("/");
        return { success: true, data: newTestimonial }
    } catch (error) {
        return { success: false, error: error.message };
    }
}