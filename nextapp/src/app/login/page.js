export default function Page() {
    return (<>
    <center>
        <h1 style = {{ color: 'Green', fontSize: '40px' }}>Login</h1>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" />
            <br />
            <input type="password" name="password" placeholder="Password" />
            <br />
            <input type="submit" value="Submit" />
        </form>
        <h1 style = {{ color: 'Green', fontSize: '40px' }}>Register</h1>
        <form action="/register" method="post">
            <input type="text" name="username" placeholder="Username" />
            <br />
            <input type="password" name="password" placeholder="Password" />
            <br />
            <input type="submit" value="Submit" />
        </form>
    </center>     
    </>);
}