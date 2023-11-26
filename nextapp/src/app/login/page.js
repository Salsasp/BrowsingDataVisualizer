export default function Page() {

  const formClass = "flex flex-col items-center";
  const submitClass = "rounded border shadow px-4 py-1 mt-2 hover:bg-lime-100";
  const fieldClass = "rounded border shadow my-1 mx-1 p-1";


  
  return (
    <div className="flex flex-row justify-center w-full h-full">
      <div className="shadow border rounded w-80 h-96 p-1 my-4 flex flex-col items-center">
              <h1 style = {{ color: 'Green', fontSize: '40px' }}>Login</h1>
              <form className={formClass} action="/login" method="post">
		<input className={fieldClass} type="text" name="username" placeholder="Username" />
		<br />
		<input className={fieldClass} type="password" name="password" placeholder="Password" />
		<br />
		<input className={submitClass} type="submit" value="Submit" />
              </form>
              <h1 style = {{ color: 'Green', fontSize: '40px' }}>Register</h1>
              <form className={formClass} action="/register" method="post">
		<input className={fieldClass} type="text" name="username" placeholder="Username" />
		<br />
		<input className={fieldClass} type="password" name="password" placeholder="Password" />
		<br />
		<input className={submitClass} type="submit" value="Submit" />
              </form>
	    </div>
      </div>
	  );
}
