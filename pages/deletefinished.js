import { useRouter } from 'next/router'
import { useEffect } from 'react'
import prisma from '../lib/dbclient'
import tokenFromCookie from '../lib/tokenFromCookie'

export default function DeleteFinished(){
    const router = useRouter()
    useEffect(()=>{
        router.push('/')
    },[])
    return <div></div>
}

export async function getServerSideProps({req,res}){
    const token = tokenFromCookie(req.headers.cookie)
    const matchedCookie = await prisma.cookies.findUnique({
        where:{
            cookie:token
        }
    })
    if(matchedCookie){
        await prisma.todo.deleteMany({
            where:{
                finished:true,
                userId:matchedCookie.userId
            }
        })
    }
    return{
        props:{}
    }
}