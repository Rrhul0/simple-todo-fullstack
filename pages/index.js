import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PrismaClient } from '@prisma/client'
import Login from '../components/login'

export default function Home(props){
    const [todos,setTodos] = useState(props.todos)
    const [isLoggedIn,setLoggedin] = useState(props.isLoggedIn)
    function onSubmitTodo(e){
        e.preventDefault()
        if(!e.target.todo.value) return
        fetch('/api/addtodo',{
            method:'POST',
            body: e.target.todo.value
        }).then(res=>res.json())
        .then(json=>{
            setTodos([...todos,json])
            console.log(todos)
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
                <form onSubmit={onSubmitTodo}>
                    <label htmlFor='addtodo'>Write Your Todo Here:</label>
                    <input id='addtodo' name='todo'></input>
                    <button type='submit'>submit</button>
                </form>
                <div id='list-todos'>
                    {todos.map(todo=>{
                        return(
                            <>
                                <div>{todo.text}</div>
                                <div>created at: {todo.timeCreated}</div>
                                <div>finished:{todo.finished.toString()}</div>
                            </>
                        )}
                    )}
                </div>
            </section>
        </div>
    )     
}

export async function getServerSideProps({req}){
    // console.log(req.headers.cookie)
    const isLoggedIn = req.headers.cookie?true:false
    if(!isLoggedIn) return{
        props:{
            isLoggedIn:isLoggedIn
        }
    }
    const hash = req.headers.cookie.split('=')[1]
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
        where:{
            hash:hash
        },
        include:{
            todos:true
        }
    })
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