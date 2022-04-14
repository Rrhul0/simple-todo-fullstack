// import finish from '../public/finish.webp'
import { useState } from 'react'
import styles from './todo.module.css'
export default function Todo(props){
    const [todo,setTodo] = useState(props.todo)
    function onClickDelete(e){
        fetch('/api/deletetodo',{
            method:'POST',
            body:new URLSearchParams({
                id:todo.id
            })
        })
        .then(res=>{
            if(res.status===200) {
                setTodo(null)
            }
        })
    }
    function onClickFinished(e){
        fetch('/api/finishtodo',{
            method:'POST',
            body:new URLSearchParams({
                id:todo.id
            })
        })
        .then(res=>setTodo({...todo,finished:true}))
    }
    if(!todo) return
    return(
        <div className={styles.todo}>
            <h3 className={styles.todo_text} style={{
                textDecoration: todo.finished?'line-through':'none'
            }}> {todo.text}</h3>
            <div className={styles.btns}>
                <button className={styles.finished} onClick={onClickFinished}>finished?</button>
                <button className={styles.delete} onClick={onClickDelete}>Delete</button>
            </div>
            <div>Created {todo.timeElapsed}</div>
        </div>
    )
}