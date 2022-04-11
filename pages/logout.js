import {useRouter} from 'next/router'
export default function Session(){
    const router = useRouter()
    router.push('/')
    return <div>Redirecting</div>
}

export async function getServerSideProps({req,res}){
    const cookie = req.headers.cookie
    if (cookie){
        res.setHeader('Set-cookie','id=null; path=/; max-age=0')
    }
    return {
        props:{}
    }
}