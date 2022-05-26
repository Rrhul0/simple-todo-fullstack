import Link from 'next/link'
import { useRef } from 'react'
import { useUser } from '../lib/hooks'
import styles from '../styles/login.module.css'

export default function Login(){
    const ref = useRef()
    useUser({redirectTo:'/',redirectIfFound:true})
    async function onSubmit(e){
        e.preventDefault()
        ref.current.style.display = 'none'
        const res = await fetch('/api/login',{
            method:'POST',
            body:new URLSearchParams(new FormData(e.target))
        })
        if (res.status !== 200){
            console.log('something done wrong with api')
            //ref.current.style.display = 'block'
        }
        const data = await res.json()
        if(data?.incorrectDetails){
            ref.current.style.display = 'block'
            return
        }
        else{
            //work redirect to the refferer url

        }
    }
    return(
        <div className={styles.whole}>
            <div className={styles.container}>
            <div className={styles.warning} ref={ref}>Incorrect Username or Password</div>
            <form onSubmit={onSubmit} className={styles.form}>
                <p className={styles.p}>Username/Email</p>
                <input type='text' name="identity" className={styles.input} required/>
                <p className={styles.p}>Password</p>
                <input type='password' name="password" className={styles.input} required/>
                <button type="submit" className={styles.submit}>LogIn</button>
            </form>
            <Link href='/forgot-password'><a>Forgot Password?</a></Link>
            <div>Not have an Account yet? <Link href='/signup'><a>SignUp</a></Link></div>
            </div>
        </div>
    )
}