import {useRouter} from 'next/router'
import prisma from '../../lib/dbclient'
export default function Session(){
    const router = useRouter()
    router.push('/devices')
    return <div>Redirecting</div>
}

export async function getServerSideProps({params}){
    
    const token = params.token
    console.log(token)
    if (token){
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