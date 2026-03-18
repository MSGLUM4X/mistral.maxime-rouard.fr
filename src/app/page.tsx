import Link from "next/link";
import Image from "next/image";
import ParticlesBg from "@/app/root-components/particles-bg";
import ServiceButton from "@/app/root-components/service-button";
import MistralButton from "@/app/root-components/mistral-button";


const HomePage = () => {
    return (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-slate-950">
            <ParticlesBg/>
            <div className="p-10 py-20 mx-5 sm:mx-0 h-fit max-w-sm bg-white/10 flex-1  backdrop-blur-sm shadow-2xl rounded-2xl  flex flex-col justify-center items-center hover:shadow-sm transition-all duration-500">
                <div className="flex flex-col gap-20 max-w-xs w-full">
                    <MistralButton callBackUrl={"callbackUrl=/chatbot"}/>
                </div>
            </div>
        </div>




    )
}

export default HomePage;