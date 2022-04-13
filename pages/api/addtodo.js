import prisma from '../../lib/dbclient'
import tokenFromCookie from '../../lib/tokenFromCookie'
export default async function handler(req,res){
    const todo = req.body
    const token = tokenFromCookie(req.headers.cookie)
    const matchedCookie = await prisma.cookies.findUnique({
        where:{
            cookie:token
        }
    })
    if(matchedCookie){
        const newTodo = await prisma.todo.create({
            data:{
                text:todo,
                userId:matchedCookie.userId
            }
        })
        res.status(200).json({...newTodo,timeCreated:newTodo.timeCreated.toString()})
    }
}
