import Banner from "@/components/Banner";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Testimonial from "@/components/Testimonial";
import UserSaying from "@/components/UserSaying";
import { featuresData } from "@/data/features";

export default function Home() {
    return (
        <>
            <Banner />
            <div className="w-full flex flex-col items-center justify-center py-20 mt-10">
                <div className="w-3/4 flex flex-wrap gap-10 justify-center">
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
