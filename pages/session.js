import bodyParser from 'body-parser'
import util from 'util'
import { PrismaClient } from '@prisma/client'
// import { parseBody } from 'next/dist/server/api-utils'

export default function Session(){
    return <div></div>
}

export async function getServerSideProps({req,res}){
    const getBody = util.promisify(bodyParser.urlencoded())
    await getBody(req,res)
    const loginData = req.body
    
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
        where:{
            username:loginData.username,
        }
    })
    await prisma.$disconnect()
    if(user){
        if(user.password=== loginData.password){
            res.setHeader('Set-cookie',`id=${user.id}; path=/`)
            return {
                redirect:{
                    destination:'/',
                    permanant:false,
                }
            }
        }
    }
    return{
        props:{}
    }
}