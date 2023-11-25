//USER PAGE
"use client";
import { useState, useEffect } from 'react';

export default function Page() {
  const [user, setUser] = useState(null);
  const [browsingData, setBrowsingData] = useState(null);

  useEffect(() => {
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

    setUser(user);
    setBrowsingData(browsingData);
  }, []);

  return <h1>User: {user}, Browsing Data: {JSON.stringify(browsingData)}</h1>;
}