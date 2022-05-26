import crypto from 'crypto'
import prisma from '../../lib/dbclient'

export default async function handler(req,res){
    if(req.method !== 'POST') {
        res.status(405).send('Only POST requests are allowed')
        return
    }
    const signupData = req.body
    if(!signupData.username||!signupData.email||!signupData.password){
        res.status(200).json({invalidDetails:true})
        return
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(signupData.password, salt, 1000, 64, 'sha512').toString('hex')

    // const hash = sum(signupData.username+signupData.password)
    try{
        const newUser = await prisma.user.create({
            data:{
                username:signupData.username,
                email:signupData.email,
                hash:hash,
                salt:salt
            }
        })
        await setTokenCookie(res,user.id)
        return res.status(200).json({userCreated:true})
    }
    catch(err){
        console.log(err)
        res.status(200).json({notAvailableDetails:true})
        // return {
        //     props:{
        //         err:'used username or email already been used'
        //     }
        // }
    }
}