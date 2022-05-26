import prisma from '../../lib/dbclient'
import {tokenFromCookie} from '../../lib/manageCookies'
import { formatDistanceToNow } from 'date-fns'
export default async function handler(req,res){
    const todo = req.body
    if(!todo) res.status(204).send('no content todo')
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
        res.status(201).json({...newTodo,timeCreated:'',timeElapsed:formatDistanceToNow(newTodo.timeCreated)})
    }
    else res.status(401).send('unauthorized')
}
