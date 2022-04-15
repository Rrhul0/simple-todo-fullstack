import prisma from "../../lib/dbclient"

export default async function handler(req,res){
    const value = req.body.value
    const name = req.body.name
    if(!value) res.status(204)
    let matchedUser
    if(name==='username'){
        matchedUser = await prisma.user.findUnique({
            where:{
                username:value
            }
        })
    }
    else if(name==='email'){
        matchedUser = await prisma.user.findUnique({
            where:{
                email:value
            }
        })
    }
    if(!matchedUser) return res.status(200).send('Available')
    else return res.status(200).send('Unavailable')
}