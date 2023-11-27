"use client"

import Graph from './components/Graph'
import {useState, useEffect} from 'react'
import {getCookie} from 'cookies-next'
import axios from 'axios'
export default function Home() {

  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [infoNode, setInfoNode] = useState(null);
  
  useEffect(() => {

      axios.get('/globalData')
	.then((res) => {
	  setData(res.data)
	  console.log(res.data)
	})
  }, [])

  return <div className="flex flex-col items-center my-4 py-4 w-full">
	   <h1 className="font-bold text-xl mt-4">Global Browsing Data</h1>
	   {data && data.nodesArray && <Graph nodes={data.nodesArray} links={data.linksArray} setInfoNode={setInfoNode}/>}
	   	   <h1 className="font-bold text-xl mt-4">{infoNode}</h1>
	 </div>;
}
