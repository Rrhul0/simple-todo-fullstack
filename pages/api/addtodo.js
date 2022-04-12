import prisma from '../../lib/dbclient'
export default async function handler(req,res){
    const todo = req.body
    const idCookie = req.headers.cookie?req.headers.cookie:null
    const hash = idCookie.split('=')[1]
    const user = await prisma.user.findUnique({
        where:{
            hash:hash
        }
    })
    if(user){
        const newTodo = await prisma.todo.create({
            data:{
                text:todo,
                userId:user.id
            }
        })
        res.status(200).json({...newTodo,timeCreated:newTodo.timeCreated.toString()})
    }
}
