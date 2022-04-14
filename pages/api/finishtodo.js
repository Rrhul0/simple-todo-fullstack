import prisma from '../../lib/dbclient'
import tokenFromCookie from '../../lib/tokenFromCookie'
export default async function handler(req,res){
    const todoId = req.body.id
    const token = tokenFromCookie(req.headers.cookie)
    const matchedCookie = await prisma.cookies.findUnique({
        where:{
            cookie:token
        }
    })
    if(matchedCookie){
        await prisma.todo.update({
            where:{
                id:+todoId
            },
            data:{
                finished:true
            }
        })
        res.status(200).send('success')
    }
}