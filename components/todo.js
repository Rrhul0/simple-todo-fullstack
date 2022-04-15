// import finish from '../public/finish.webp'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styles from './todo.module.css'

export default function Todo(props){
    const [todo,setTodo] = useState(props.todo)
    const router = useRouter()
    function onClickDelete(){
        setTodo(null)
        fetch('/api/deletetodo',{
            method:'POST',
            body:new URLSearchParams({
                id:todo.id
            })
        })
        .then(res=>{
            if(res.status===401) {
                router.push('/unauthorized')
            }
        })
    }
    function onClickFinished(e){
        setTodo({...todo,finished:!todo.finished})
        e.target.textContent = todo.finished?'finished?':'unfinished?'
        
        fetch('/api/finishtodo',{
            method:'POST',
            body:new URLSearchParams({
                id:todo.id,
                isFinish:!todo.finished?'yes':'no'
            })
        })
        .then(res=>{
            if(res.status===401) {
                router.push('/unauthorized')
            }
        })
        
    }
    if(!todo) return
    return(
        <div className={styles.todo}>
            <h3 className={styles.todo_text} style={{
                textDecoration: todo.finished?'line-through':'none'
            }}> {todo.text}</h3>
            <div className={styles.btns}>
                <button className={styles.finished} onClick={onClickFinished}>{!todo.finished?'finished?':'unfinished?'}</button>
                <button className={styles.delete} onClick={onClickDelete}>Delete</button>
            </div>
            <div>Created {todo.timeElapsed} ago</div>
        </div>
    )
}