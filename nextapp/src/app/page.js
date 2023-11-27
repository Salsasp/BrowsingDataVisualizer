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

  return <div className="flex flex-col items-center mt-10">
	   {data && data.nodesArray && <Graph nodes={data.nodesArray} links={data.linksArray} setInfoNode={setInfoNode}/>}
	   	   <h1 className="text-bold text-lg mt-4">{infoNode}</h1>
	 </div>;
}
