//USER PAGE
"use client";
import { useState, useEffect} from 'react';
import { redirect } from 'next/navigation'
import {getCookie} from 'cookies-next'
import axios from 'axios'
import Graph from '@/components/Graph'


export default function Page() {

  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [infoNode, setInfoNode] = useState(null);
  
  useEffect(() => {

    const username = getCookie('user').replace(/"+/g, '');
    setUser(username);

    if (!username) {
      redirect('/login');
    } else {

      console.log("username: ", username)
      axios.get('/userData', {
	params: {
	  user: username}
      })
	.then((res) => {
	  setData(res.data)
	  console.log(res);
	})
    }
  }, [])

  return <div className="flex flex-col items-center mt-10">
	   <h1 className="font-bold text-xl mt-4">{user}'s Browsing Data</h1>
	   {data && <Graph nodes={data.nodesArray} links={data.linksArray} setInfoNode={setInfoNode}/>}
	   	   <h1 className="font-bold text-xl mt-4">{infoNode}</h1>
	 </div>;
}
