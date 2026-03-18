import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import prisma from '@/lib/prisma'
import {DefaultUser} from "@auth/core/types";

declare module "next-auth" {
    interface User extends DefaultUser {
        email_verified?: boolean;
    }
}

const ALLOW_EMAIL = JSON.parse(process.env.ALLOW_EMAIL ?? "[]") as string[];
const ALLOW_DOMAINS = JSON.parse(process.env.ALLOW_DOMAINS ?? "[]") as string[];

const allowDomains = (email:string) => {
    //Accept all email
    return true;
    if (ALLOW_EMAIL.includes(email)){
        return true;
    }
    const domain = email.split("@")[1];
    return ALLOW_DOMAINS.includes(domain);
}

export const { auth, handlers, signIn, signOut  } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    providers: [GitHub({
        authorization: {
            params: {
                prompt: "select_account",
                scope: "read:user user:email",
            },
        },
        async profile(profile, tokens) {
            const res = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                    Accept: "application/vnd.github+json",
                },
            });

            const emails: {
                email: string;
                verified: boolean;
                primary: boolean;
            }[] = await res.json();

            const verifiedAllowedEmail = emails.find(e => e.verified && allowDomains(e.email));
            const email : string =  verifiedAllowedEmail?.email || '';
            const email_verified : boolean = (verifiedAllowedEmail!=undefined);
            return {
                id: profile.id.toString(),
                name: profile.name ?? profile.login,
                email: email,
                email_verified: email_verified,
                image: profile.avatar_url,
            };
        },
    }), Google({
        authorization: {
            params: {
                prompt: "select_account",
            },
        }})
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }){
            const callbackUrl = nextUrl.searchParams.get('callbackUrl') || '/';
            const isLoggedIn = !!auth?.user;
            const isOnChatbot = nextUrl.pathname.startsWith('/chatbot');
            const isOnAuth = nextUrl.pathname.startsWith('/auth')
            const isOnMenu = nextUrl.pathname === '/'

            if (isOnChatbot) {
                if (isLoggedIn) return true;
                return false;
            }
            if (isOnAuth){
                if (isLoggedIn) return Response.redirect(new URL(callbackUrl, nextUrl));
                return true;
            }
            if (isOnMenu){
                return true;
            }
            return false;
        },
        async signIn({account, profile, user}) {

            if (!account || !profile || !profile.email) {
                return false;
            }

            switch (account.provider) {
                case "github":
                    if (!user.email_verified) return false;
                    break;
                case "google":
                    if (!profile.email_verified) return false;
                    break;
                default:
                    return false;
            }

            if (!allowDomains(profile.email)) return false;

            let dbUser = await prisma.user.findUnique({
                where:{
                    email:profile.email
                }
            })

            if (!dbUser) {
                dbUser = await prisma.user.create({
                    data: {
                        email: profile.email,
                    },
                })
            }
            user.id = dbUser.id.toString();
            return true;


        },
        jwt({ token, user }) {
            if (user) { // User is available during sign‑in
                token.id = user.id
                console.log("jwt-user")
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            return session
        },
    }
});

