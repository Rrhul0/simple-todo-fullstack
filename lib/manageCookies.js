import prisma from "./dbclient"
import crypto from 'crypto'

export function tokenFromCookie(cookies){
    if(!cookies) return undefined
    if(!cookies.match(/;/)){
        if(cookies.match(/token/)) {
            return cookies.split('=')[1]
        }
    }
    for (let cookie of cookies.split(';')){
        if(cookie.match(/token/)) {
            return cookie.split('=')[1]
        }
    }
    return undefined
}

export async function setTokenCookie(res,userID){
    const newCookie = await prisma.cookies.create({
        data:{
            cookie:crypto.randomBytes(20).toString('hex'),
            userId: userID
        }
    })
    res.setHeader('Set-cookie',`token=${newCookie.cookie}; path=/; max-age=${7*24*60*60}; HttpOnly=true; ${process.env.NODE_ENV === 'production'?'Secure':''}; SameSite=lax`)
}