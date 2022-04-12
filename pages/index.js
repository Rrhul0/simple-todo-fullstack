import Link from 'next/link'
import { useState } from 'react'
import Login from '../components/login'
import prisma from '../lib/dbclient'

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
        })
        // setTodos()
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
            <section id='todos'>
                <div id='error-addtodo' style={{display: 'none'}}>Please write a todo!</div>
                <form onSubmit={onSubmitTodo}>
                    <label htmlFor='addtodo'>Write Your Todo Here:</label>
                    <input id='addtodo' name='todo'></input>
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
    // console.log(req.headers.cookie)
    const isLoggedIn = req.headers.cookie?true:false
    if(!isLoggedIn) return{
        props:{
            isLoggedIn:isLoggedIn
        }
    }
    const hash = req.headers.cookie.split('=')[1]
    const user = await prisma.user.findUnique({
        where:{
            hash:hash
        },
        include:{
            todos:true
        }
    })
    if(user){
        return {
            props:{
                isLoggedIn:isLoggedIn,
                id:user.id,
                username:user.username,
                todos:user.todos.map(todo=>{
                    return {...todo,timeCreated:todo.timeCreated.toString()}
                })
            }
        }
    }
    else{
        res.setHeader('Set-cookie','id=null; path=/; max-age=0')
        return{
            props:{
                isLoggedIn:false
            }
        }
    }
}