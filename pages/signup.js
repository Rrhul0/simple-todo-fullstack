import bodyParser from 'body-parser'
import util from 'util'
import sum from 'hash-sum'
import prisma from '../lib/dbclient'
import crypto from 'crypto'
import tokenFromCookie from '../lib/tokenFromCookie'

export default function Signup(){

    return(
        <form action="signup" method="POST">
            <label htmlFor="username">Username(unique):</label>
            <input id="username" name='username'/>
            <label htmlFor="email">Email:</label>
            <input id="email" type='email' name="email"/>
            <label htmlFor="password">Password:</label>
            <input id="password" type='password' name="password"/>
            {/* <input type='hidden' name='useragent'/> */}
            <button type="submit">submit</button>
        </form>
    )
}

export async function getServerSideProps({req,res}){
    if(req.method==='GET'){
        if(tokenFromCookie(req.headers.cookie)) return{
            redirect:{
                destination:'/',
                permanant:false,
            }
        }
        return {
            props:{}
        }
    }
    let platform = 'Unknown'
    let browser = 'Unknown'
    if(req.headers['user-agent'].match(/Chrome/)) browser = 'Chrome'
    else if(req.headers['user-agent'].match(/Safari/)) browser = 'Safari'
    else if(req.headers['user-agent'].match(/Firefox/)) browser = 'Firefox'
    
    if(req.headers['user-agent'].match(/Android/)) platform = 'Android'
    else if(req.headers['user-agent'].match(/Mac OS X/)) platform = 'MacOS'
    else if(req.headers['user-agent'].match(/Linux/)) platform = 'Linux'
    else if(req.headers['user-agent'].match(/Win/)) platform = 'Windows'
    else if(req.headers['user-agent'].match(/CrOS/)) platform = 'ChromeOS'

    const device = platform==='Unknown'&&browser==='Unknown'? platform:browser+' Browser in '+platform

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
    const newCookie = await prisma.cookies.create({
        data:{
            cookie:crypto.randomBytes(20).toString('hex'),
            userId: newUser.id,
            device:device
        }
    })
    res.setHeader('set-Cookie',`token=${newCookie.cookie}; path=/; max-age=${7*24*60*60}`)
    return {
        redirect:{
            destination:'/',
            permanant:false,
        }
    }
}
