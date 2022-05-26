import {useRouter} from 'next/router'
import prisma from '../../lib/dbclient'
import tokenFromCookie from '../../lib/tokenFromCookie'
export default function Session(){
    const router = useRouter()
    router.push('/')
    return <div>Redirecting</div>
}

export async function getServerSideProps({req,res}){
    const token = tokenFromCookie(req.headers.cookie)
    if (token){
        res.setHeader('Set-cookie','token=null; path=/; max-age=0')
        await prisma.cookies.delete({
            where:{
                cookie:token
            }
        })
    }
    return {
        props:{}
    }
}