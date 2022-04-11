import {PrismaClient} from '@prisma/client'
export default async function handler(req,res){
    const todo = req.body
    const idCookie = req.headers.cookie?req.headers.cookie:null
    const id = +idCookie.split('=')[1]
    const prisma = new PrismaClient()
    const newTodo = await prisma.todo.create({
        data:{
            text:todo,
            userId:id
        }
    })
    await prisma.$disconnect();
    res.status(200).json({...newTodo,timeCreated:newTodo.timeCreated.toString()})
}
