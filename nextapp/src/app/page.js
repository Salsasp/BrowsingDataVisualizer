"use client"

import BrowsingGraph from './components/Graph'
import {useState} from 'react'

export default function Home() {

  const nodes = ["first", "second", "third", "fourth", "fifth"];
  const links = [{source: "first", target: "second"}, {source: "second", target: "third"}, {source: "fourth", target: "fifth"}, {source: "first", target: "fifth"}, {source: "second", target: "first"}, {source: "third", target: "fourth"} ];

  const [infoNode, setInfoNode] = useState(null);
  return (
    <div className="flex flex-col items-center">

      <div className="w-1/2 p-5 flex flex-row items-center">
	<BrowsingGraph nodes={nodes} links={links} setInfoNode={setInfoNode}/>

	{infoNode && <p className="mx-4 text-xl font-bold">
		       Current node: {infoNode}
		     </p>}
      </div>
    </div>
  )
}
