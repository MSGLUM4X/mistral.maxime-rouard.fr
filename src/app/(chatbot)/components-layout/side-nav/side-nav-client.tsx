'use client'

import {useSession} from "next-auth/react"
import {useState} from 'react';
import LogOutButton from "@/app/(chatbot)/components-layout/side-nav/log-out-button";
import Image from "next/image";
import Link from "next/link"




const SideNavClient = ({
                           children,
                       }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: session } = useSession()

    const handleCreate = () => {

    }

    return (
        <div>
            {isExpanded && (
                <div className="h-screen w-screen bg-gray-300 md:hidden">
                    <p></p>
                </div>
            )}

            <div className="hidden md:flex h-screen border-r border-black  bg-gray-100">
                <div
                    className={`text-black transition-all duration-300 ease-in-out ${
                        isExpanded ? 'w-64' : 'w-12'
                    } flex flex-col `}
                >
                    <div className=" h-12 w-full flex items-center justify-center border-b border-black">
                        <Image className="cursor-pointer"  src={isExpanded ? "/icons/pane-open-svgrepo-com.svg" : "/icons/pane-close-svgrepo-com.svg"} alt="Navigation" width={24} height={24} onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Réduire' : 'Étendre'}/>
                    </div>

                    <Link
                        href={"/chatbot"}
                        className="w-full border-b cursor-pointer flex"
                    >
                        <div className={`m-1 h-6 w-full flex flex-row items-center justify-start`}>
                            <div className="w-10 flex-shrink-0 flex items-center justify-center">
                                <Image src= "/icons/tab-new-svgrepo-com.svg" alt="New conv" width={28} height={28} title='Nouvelle conversation'/>
                            </div>
                            {isExpanded && (<span className={`ml-1 mt-1 truncate`}>Nouvelle Conversation</span>)}
                        </div>
                    </Link>

                    <div className="flex-1 overflow-y-auto">
                        {isExpanded && children}
                    </div>


                    <div className="p-4 border-t border-black flex flex-col">
                        <div
                            className={`flex items-center gap-3 ${
                                !isExpanded && 'justify-center'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0">
                                <Image src="/icons/person-svgrepo-com.svg" alt="Send" width={24} height={24}/>
                            </div>
                            {isExpanded && (
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate">{session?.user?.name || "User"}</p>
                                    <p className="text-sm truncate">{session?.user?.email || "User"}</p>
                                </div>
                            )}

                        </div>
                        {isExpanded && <LogOutButton/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideNavClient;