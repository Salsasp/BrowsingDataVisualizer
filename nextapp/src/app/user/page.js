//USER PAGE
"use client";
import { useState, useEffect} from 'react';
import { redirect } from 'next/navigation'
import {getCookie} from 'cookies-next'
import User, { UserContext } from '@/components/User'




export default function Page() {

  const [user, setUser] = useState(null);
  
  
  useEffect(() => {
    setUser(getCookie('user'))

    if (!getCookie('user')) {
      redirect('/login');
    }
  })

  
}
