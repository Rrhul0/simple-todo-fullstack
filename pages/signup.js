import bodyParser from 'body-parser'
import util from 'util'
import sum from 'hash-sum'
import prisma from '../lib/dbclient'

export default function Signup(){

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
    if(!signupData.username||!signupData.email||!signupData.password) return{props:{}}
    const hash = sum(signupData.username+signupData.password)
    
    const newUser = await prisma.user.create({
        data:{
            username:signupData.username,
            email:signupData.email,
            hash:hash
        }
    })
    res.setHeader('set-Cookie',`id=${newUser.hash}; path=/`)
    return {
        redirect:{
            destination:'/',
            permanant:false,
        }
    }
}
