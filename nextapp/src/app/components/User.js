import { redirect } from 'next/navigation'
import { useState, useEffect, createContext } from 'react'

export const UserContext = createContext(null);

export default function User({show=true, isRedirect=false, children}) {

  

  function getCookies() {
    const cookieString = document.cookie;
    const cookieArray = cookieString.split('; ');
    const cookieObject = {};

    cookieArray.forEach(cookie => {
      const [name, value] = cookie.split('=');
      cookieObject[name] = decodeURIComponent(value);
    });

    return cookieObject;
  }

  const cookies = getCookies();
  const user = cookies.user ? JSON.parse(cookies.user) : null;
  const browsingData = cookies.browsingData ? JSON.parse(cookies.browsingData) : null;

  if (!user && isRedirect) {
    redirect('/login')
  }


  let toReturn = null;

  if (show && user || !show && !user) {
    toReturn = <UserContext.Provider value={user}>
		 {children}
 	       </UserContext.Provider>;
  } 

  
  return toReturn;
}
