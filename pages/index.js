import Link from 'next/link'
import { useState } from 'react'
import Login from '../components/login'
import prisma from '../lib/dbclient'
import tokenFromCookie from '../lib/tokenFromCookie'

export default function Home(props){
    const [todos,setTodos] = useState(props.todos)
    const [isLoggedIn,setLoggedin] = useState(props.isLoggedIn)
    function onSubmitTodo(e){
        e.preventDefault()
        document.querySelector('#error-addtodo').style.display = 'none'
        if(!e.target.todo.value) {
            document.querySelector('#error-addtodo').style.display = 'block'
            return
        }
        fetch('/api/addtodo',{
            method:'POST',
            body: e.target.todo.value
        }).then(res=>res.json())
        .then(json=>{
            setTodos([...todos,json])
            e.target.todo.value = ''
        })
    }
    if(!isLoggedIn) return(
        <div>
            <Login/>
            <Link href='/signup'><a>Signup</a></Link>
        </div>
    )
    return(
        <div>
            <Link href='/logout'><a>LogOut</a></Link>
            <div>id: {props.id}</div>
            <div>username: {props.username}</div>
            <div>Total Todos: {todos.length}</div>
            <div>Login devices: <Link href='/devices'><a>{props.loginCount} devices</a></Link></div>
            <section id='todos'>
                <div id='error-addtodo' style={{display: 'none'}}>Please write a todo!</div>
                <form onSubmit={onSubmitTodo}>
                    <label htmlFor='todo'>Write Your Todo Here:</label>
                    <input id='todo' name='todo'></input>
                    <button type='submit'>submit</button>
                </form>
                <div id='list-todos'>
                    {todos.map(todo=>{
                        return(
                            <div key={todo.id}>
                                <div>{todo.text}</div>
                                <div>created at: {todo.timeCreated}</div>
                                <div>finished:{todo.finished.toString()}</div>
                            </div>
                        )}
                    )}
                </div>
            </section>
        </div>
    )     
}

export async function getServerSideProps({req,res}){

    const token = tokenFromCookie(req.headers.cookie)
    if(!token){
        return{
            props:{
                isLoggedIn:false
            }
        }
    }
    const cookie = await prisma.cookies.findUnique({
        where:{
            cookie:token
        },
        include:{
            User:{
                include:{
                    todos:true,
                    Cookies:true
                }
            }
        }
    })
    if(cookie){
        return{
            props:{
                isLoggedIn:true,
                id:cookie.userId,
                username:cookie.User.username,
                todos:cookie.User.todos.map(todo=>{
                    return {...todo,timeCreated:todo.timeCreated.toString()}
                }),
                loginCount:cookie.User.Cookies.length
            }
        }
    }
    res.setHeader('Set-cookie','token=null; path=/; max-age=0')
    return{
        props:{
            isLoggedIn:false
        }
    }
}