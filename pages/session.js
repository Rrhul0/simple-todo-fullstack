import bodyParser from 'body-parser'
import util from 'util'
import { PrismaClient } from '@prisma/client'
import sum from 'hash-sum'
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
    console.log(sum(loginData.username + loginData.password))
    console.log(user.hash)
    if(user){
        if(user.hash=== sum(loginData.username + loginData.password)){
            res.setHeader('Set-cookie',`id=${user.hash}; path=/`)
            console.log(sum(loginData.email + loginData.password))
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