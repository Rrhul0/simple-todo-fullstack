import bodyParser from 'body-parser'
import util from 'util'
import sum from 'hash-sum'
import prisma from '../lib/dbclient'
import crypto from 'crypto'
// import { parseBody } from 'next/dist/server/api-utils'

export default function Session(){
    return <div></div>
}

export async function getServerSideProps({req,res}){
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
    const loginData = req.body
    const user = await prisma.user.findUnique({
        where:{
            username:loginData.username,
        }
    })
    if(user){
        if(user.hash=== sum(loginData.username + loginData.password)){
            const newCookie = await prisma.cookies.create({
                data:{
                    cookie:crypto.randomBytes(20).toString('hex'),
                    userId: user.id,
                    device:device
                }
            })
            res.setHeader('Set-cookie',`token=${newCookie.cookie}; path=/; max-age=${7*24*60*60}`)
        }
    }return {
        redirect:{
            destination:'/',
            permanant:false,
        }
    }
}