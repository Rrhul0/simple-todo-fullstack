import Link from "next/link";


export default function Unauthorized(){
    return(
        <div>Session logged out! <Link href='/'><a>Login</a></Link></div>
    )
}