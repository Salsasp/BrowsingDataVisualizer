"use client"

import Link from "next/link"
import {deleteCookie, getCookie} from 'cookies-next'
import {useState, useEffect} from 'react'



export default function NavBar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCookie('user'))
    console.log(user);
  })
  
  
  return <nav className="bg-green-600 py-4 px-2 shadow">
	   <ul className="list-style-none flex">
	     <li>
	       <Link href="/" className="text-white text-bold mx-2">Home</Link>
	     </li>
	     {user && 
		<li>
		  <Link href="/user" className="text-white text-bold mx-2">Profile</Link>
		</li>
		
	     }

	     {user && <li>
			<Link href="/" onClick={() => {deleteCookie('user')
						       setUser(null)}} className="text-white text-bold mx-2">Logout</Link>
		</li>}
	     {!user &&
	       <li>
		<Link href="/login" className="text-white text-bold mx-2">Login</Link>
	       </li>
	      }
	   </ul>
	 </nav>
}
