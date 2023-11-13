import Link from "next/link"

export default function NavBar() {
  return <nav className="bg-green-600 py-4 px-2 shadow">
	   <ul className="list-style-none flex">
	     <li>
	       <Link href="/" className="text-white text-bold mx-2">Home</Link>
	     </li>
	     <li>
	       <Link href="#" className="text-white text=bold mx-2">Profile</Link>
	     </li>
	     <li>
	       <Link href="#" className="text-white text=bold mx-2">Personal Stats</Link>
	     </li>
	     <li>
	       <Link href="#" className="text-white text=bold mx-2">Global Stats</Link>
	     </li>
	   </ul>
	 </nav>
}
