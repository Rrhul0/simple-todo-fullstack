import {tokenFromCookie} from "../../lib/manageCookies"
import prisma from "../../lib/dbclient"

export default async function user(req,res){
    if(req.method!=='GET') return res.status(405).send('only GET requests are allowed')
    const token = tokenFromCookie(req.headers.cookie)
    if(!token) return res.status(200).send('no token')
    try{
        const matchedCookie = await prisma.cookies.findUnique({
            where:{
                cookie:token
            },include:{
                User:true
            }
        })
        return res.status(200).json({user:{username:matchedCookie.User.username,email:matchedCookie.User.email}})
    }
    catch(e){
        console.log('error occorred in /api/user')
        return res.status(200).send('invalid token')
    }
}