import Link from "next/link"

export default function NavBar() {
  return <nav className="bg-green-600 py-4 px-2 shadow">
	   <ul className="list-style-none flex">
	     <li>
	       <Link href="/" className="text-white text-bold mx-2">Home</Link>
	     </li>
	     <li>
	       <Link href="/login" className="text-white text=bold mx-2">Profile</Link>
	     </li>
	   </ul>
	 </nav>
}
