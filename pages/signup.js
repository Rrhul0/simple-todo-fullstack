import bodyParser from 'body-parser'
import util from 'util'
import { PrismaClient } from '@prisma/client'

export default function Signup(){
    function onSubmitForm(e){
        e.preventDefault()
        const data = {
            username:e.target.username.value,
            email:e.target.email.value,
            password:e.target.password.value,
        }
        console.log(data)
        if(!data.username||!data.email||!data.password) return
        fetch('signup',{
            method:'POST',
            body:JSON.stringify(data),
            credentials:'same-origin'
        }).then(res=>{
            if(res.status===200) console.log('seccesfully sign up')
        })
    }
    return(
        <form action="signup" method="POST">
            <label htmlFor="username">Username(unique):</label>
            <input id="username" name='username'/>
            <label htmlFor="email">Email:</label>
            <input id="email" type='email' name="email"/>
            <label htmlFor="password">Password:</label>
            <input id="password" type='password' name="password"/>
            <button type="submit">submit</button>
        </form>
    )
}

export async function getServerSideProps({req,res}){
    if(req.method==='GET'){
        if(req.headers.cookie) return{
            redirect:{
                destination:'/',
                permanant:false,
            }
        }
        return {
            props:{}
        }
    }
    const getBody = util.promisify(bodyParser.urlencoded())
    await getBody(req,res)
    const signupData = req.body
    
    const prisma = new PrismaClient()
    const newUser = await prisma.user.create({
        data:signupData
    })
    await prisma.$disconnect()
    res.setHeader('set-Cookie',`id=${newUser.id}; path=/`)
    return {
        redirect:{
            destination:'/',
            permanant:false,
        }
    }
}