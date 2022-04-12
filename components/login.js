export default function Login(){
    return (
        <>
            <div>Login</div>
            <form action='/session' method='post'>
                <label htmlFor="username">Username:</label>
                <input id="username" name='username'/>
                <label htmlFor="password">Password:</label>
                <input id="password" type='password' name="password"/>
                <button type="submit">Login</button>
            </form>
        </>
    )  
}