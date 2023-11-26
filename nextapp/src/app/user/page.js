//USER PAGE
"use client";
import { useState, useEffect, useContext } from 'react';
import { redirect } from 'next/navigation'
import User, { UserContext } from '@/components/User'


function Test() {

  const user = useContext(UserContext);
  
  return <div>{user}</div>
}


export default function Page() {
  return <User isRedirect={true}>
	   <Test />
	 </User>;
}
