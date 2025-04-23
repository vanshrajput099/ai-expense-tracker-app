import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Testimonial from "@/components/Testimonial";
import { featuresData } from "@/data/features";
import Image from "next/image";
import aiImage from "@/assets/ai.jpg"
import colors from "@/colors";

export default function Home() {
    return (
        <>
            <div className='w-full flex flex-col justify-center items-center mt-20 gap-5'>
                <div className='w-2/3 text-center max-sm:w-full max-sm:px-5'>
                    <h1 style={{ color: colors.textPrimary }} className='text-5xl max-sm:text-2xl'>Welcome To</h1>
                    <h1 style={{ color: colors.textPrimary }} className='text-6xl font-bold mt-3 max-sm:text-4xl'>AI Expense Tracker</h1>
                    <p style={{ color: colors.textSecondary }} className='text-xl mt-5 tracking-wider leading-normal max-sm:text-lg'>Managing finances just got smarter! Our AI-powered expense tracker helps you monitor income, track expenses, and set savings goals with ease. With advanced security measures, real-time insights, and automated reminders, you stay in control of your finances effortlessly. Let AI analyze your spending habits and provide smart recommendations to optimize your budget. Secure, intelligent, and user-friendly—your ultimate financial companion!</p>
                </div>
                <Image alt={'ai.png'} src={aiImage} className='rounded-2xl max-sm:px-5' />
            </div>
            <div className="w-full flex flex-col items-center justify-center py-10">
                <div className="w-full flex p-10 justify-center">
                    <h1 className="text-white text-3xl font-bold">Features</h1>
                </div>
                <div className="w-3/4 flex flex-wrap gap-5 justify-center max-sm:w-full max-sm:justify-around">
                    {
                        featuresData.map((ele, idx) => {
                            return <Features data={ele} key={idx} />
                        })
                    }
                </div>
            </div>
            <Testimonial />
            <Footer />
        </>
    );
}
