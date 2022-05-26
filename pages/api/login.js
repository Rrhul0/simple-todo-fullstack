import prisma from "../../lib/dbclient"
import crypto from 'crypto'
import { setTokenCookie } from "../../lib/manageCookies"

export default async function handler(req,res){
    if(req.method !== 'POST') {
        return res.status(405).send('Only POST requests are allowed')
    }
    const identity = req.body?.identity
    const password = req.body?.password
    if(!identity||!password) return res.status({missingDetails:true})
    const identityIsEmail = identity.includes('@')
    try{
        let user
        if(identityIsEmail) user = await prisma.user.findUnique({
                where:{
                    email:identity
                }
            })
        else user = await prisma.user.findUnique({
                where:{
                    username:identity
                }
            })
        const inputHash = crypto
                    .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
                    .toString('hex')
        if(user.hash === inputHash){
            await setTokenCookie(res,user.id)
            return res.status(200).json({email:user.email,username:user.username})
        }
        else return res.status({incorrectDetails:true})
    }
    catch(e){
        //no user found with identity
        return res.status(200).json({incorrectDetails:true})
    }
}