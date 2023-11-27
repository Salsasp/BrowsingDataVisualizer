"use client"

import { redirect } from 'next/navigation'
import { useState, useEffect, createContext } from 'react'
import {getCookie} from 'cookies-next'

export const UserContext = createContext(null);

export default function User({show=true, isRedirect=false, children}) {


  const user  = getCookie('user');


  if (!user && isRedirect) {
    redirect('/login')
  }


  console.log(user)
  

  let toReturn = null;

  if (show && user || !show && !user) {
    toReturn = <UserContext.Provider value={user}>
		 {children}
 	       </UserContext.Provider>;
  } 

  
  return toReturn;
}
