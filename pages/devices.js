import prisma from "../lib/dbclient";
import tokenFromCookie from "../lib/tokenFromCookie";

export default function Devices(props){
    if(!props.devices) return <div>Make sure you Logged In</div>
    return(
        <>
            {props.devices.map(device=>{
                return (
                <div key={device.timeLogin}>
                    <div>Device: {device.device}</div>
                    <div>Logged In at {device.timeLogin}</div>
                </div>
                )
            })}
        </>
    )
}

export async function getServerSideProps({req}){
    const token = tokenFromCookie(req.headers.cookie)
    if(!token) return{
        props:{}
    }
    const matchedCookie = await prisma.cookies.findUnique({
        where:{
            cookie:token
        },
        include:{
            User:{
                include:{
                    Cookies:true
                }
            }
        }
    })
    if(matchedCookie){
        const allCookies = matchedCookie.User.Cookies
        const allDevices = allCookies.map(cookie=>{
            if(cookie.device) return {
                device:cookie.device,
                timeLogin:cookie.timeCreated.toString()
            }
        })
        return{
            props:{
                devices:allDevices
            }
        }
    }
}