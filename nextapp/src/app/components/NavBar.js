"use client"

import Link from "next/link"
import User from "@/components/User"
export default function NavBar() {

  console.log(<User isRedirect={false} />);
  
  return <nav className="bg-green-600 py-4 px-2 shadow">
	   <ul className="list-style-none flex">
	     <li>
	       <Link href="/" className="text-white text-bold mx-2">Home</Link>
	     </li>
	     {<User>
		<li>
		  <Link href="/user" className="text-white text-bold mx-2">Profile</Link>
		</li>
	      </User> || "test"}
	     {<User show={false}>
	       <li>
		<Link href="/login" className="text-white text-bold mx-2">Login</Link>
	       </li>
	      </User>}
	   </ul>
	 </nav>
}
