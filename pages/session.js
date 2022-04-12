import bodyParser from 'body-parser'
import util from 'util'
import sum from 'hash-sum'
import prisma from '../lib/dbclient'
// import { parseBody } from 'next/dist/server/api-utils'

export default function Session(){
    return <div></div>
}

export async function getServerSideProps({req,res}){
    const getBody = util.promisify(bodyParser.urlencoded())
    await getBody(req,res)
    const loginData = req.body
    const user = await prisma.user.findUnique({
        where:{
            username:loginData.username,
        }
    })
    if(user){
        if(user.hash=== sum(loginData.username + loginData.password)){
            res.setHeader('Set-cookie',`id=${user.hash}; path=/`)
        }
    }return {
        redirect:{
            destination:'/',
            permanant:false,
        }
    }
}