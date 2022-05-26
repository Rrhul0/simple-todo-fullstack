import Link from "next/link"
import { useRef } from "react"
import styles from '../styles/login.module.css'
export default function ForgotPassword(){
    const ref = useRef()
    async function onSubmit(e){
        //todo
    }
    return(
        <div className={styles.whole}>
            <div className={styles.container}>
            <div className={styles.warning} ref={ref}>Incorrect Username or Email</div>
            <form onSubmit={onSubmit} className={styles.form}>
                <p className={styles.p}>Username<span style={{color:'red'}}>*</span></p>
                <input type='text' name="username" className={styles.input} required/>
                <p className={styles.p} >Email<span style={{color:'red'}}>*</span></p>
                <input type='email' name="email" className={styles.input} required/>
                <button type="submit" className={styles.submit}>Reset</button>
            </form>
            <Link href='/login'><a>Login?</a></Link>
            <div>Not have an Account yet? <Link href='/signup'><a>SignUp</a></Link></div>
            </div>
        </div>
    )
}