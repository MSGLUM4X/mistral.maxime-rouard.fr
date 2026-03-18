import prisma from '@/lib/prisma';


type AuthLogType = {
    email:string,
    success:boolean,
    emailVerified:boolean
}


export const authLog = async ({email,success,emailVerified}:AuthLogType) => {
    await prisma.authLog.upsert({
        where: {
            email:email
        },
        update: {
            updatedAt: new Date(),
            success:success,
        },
        create: {
            email:email,
            emailVerified:emailVerified,
            success: success,
        }
    })
}

