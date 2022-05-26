import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef,useState } from 'react'
import { useUser } from '../lib/hooks'
import styles from '../styles/login.module.css'
import newStyles from '../styles/signuponly.module.css'

export default function Signup(){
    useUser({redirectTo:'/',redirectIfFound:true})
    const [usernameAvail,setUsernameAvail] = useState(null)
    const [emailAvail,setEmailAvail] = useState(null)
    const refUsernameAvail = useRef()
    const refEmailAvail = useRef()
    const router = useRouter()

    async function onBlurInput(e){
        if(e.target.value==='') return
        const ref = e.target.name==='email'?refEmailAvail:refUsernameAvail
        ref.current.textContent = 'Loading...'

        const res = await fetch('/api/checkavailable',{
            method:'POST',
            body: new URLSearchParams({
                name:e.target.name,
                value:e.target.value
            })
        })
        if(res.status!==200) return
        const availablity = (await res.json()).availablity
        e.target.name==='email' && setEmailAvail(availablity)
        e.target.name==='username' && setUsernameAvail(availablity)
        ref.current.style.color = availablity?'green':'red'
        ref.current.textContent = availablity?'Available':'Not Available'
        
    }

    async function onSubmit(e){
        e.preventDefault()
        if(!usernameAvail||!emailAvail) return
        const res = await fetch('/api/signup',{
            method:'POST',
            body:new URLSearchParams(new FormData(e.target))
        })
        if (res.status !== 200){
            console.log('something done wrong with api')
            //ref.current.style.display = 'block'
        }
        // const data = await res.json()
        // if(data?.userCreated){
        //     router.push('/')
        //     return
        // }
        else return
    }
    return(
        <div className={styles.whole}>
            <div className={styles.container}>
            <form onSubmit={onSubmit} className={styles.form}>
                <p className={styles.p}>Username</p>
                <input type='text' name="username" className={styles.input} required onBlur={onBlurInput}/>
                <div className={newStyles.availablity} ref={refUsernameAvail}></div>
                <p className={styles.p}>Email</p>
                <input type='email' name="email" className={styles.input} required onBlur={onBlurInput}/>
                <div className={newStyles.availablity} ref={refEmailAvail}></div>
                <p className={styles.p}>Password</p>
                <input type='password' name="password" className={styles.input} required/>
                <button type="submit" className={styles.submit} disabled={!usernameAvail||!emailAvail}>LogIn</button>
            </form>
            <div>Already have an Account? <Link href='/login'><a>LogIn</a></Link></div>
            </div>
        </div>
    )
}