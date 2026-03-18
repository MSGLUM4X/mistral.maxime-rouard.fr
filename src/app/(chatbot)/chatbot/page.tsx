import PromptBar from "@/app/(chatbot)/components-page/prompt-bar";
import WelcomeMessage from "@/app/(chatbot)/components-page/welcome-message";
import FormClient from "@/app/(chatbot)/components-page/form-client";
import TitleForm from "@/app/(chatbot)/components-page/title-form";
import ModelForm from "@/app/(chatbot)/components-page/model-form";
import {Suspense} from "react";
import {WelcomeMessageSkeleton} from "@/ui/skeleton";


const ChatBotPage = () => {

    return (
        <FormClient className="w-full h-full flex flex-col items-center justify-start
         bg-gradient-to-b from-gray-500 to-white dark:from-slate-900 dark:to-slate-light"
        >
            <div className="mt-50 mb-30">
                <Suspense fallback={<WelcomeMessageSkeleton/>}>
                    <WelcomeMessage/>
                </Suspense>
            </div>

            <div className="mb-10 flex flex-row items-center gap-20 w-4/5 max-w-4xl justify-between">
                <TitleForm/>
            </div>
            <PromptBar/>
        </FormClient>
    )
}

export default ChatBotPage;