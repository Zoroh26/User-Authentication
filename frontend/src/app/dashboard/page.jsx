'use client';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [quote, setQuote] = useState('');
  const [tempQuote, setTempQuote] = useState('');
  const router = useRouter(); 

  async function populateQuote() {
    const req = await fetch('http://localhost:1337/api/quote', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    });
    const data = await req.json();
    if (data.status === 'ok') {
      setQuote(data.quote);
    } else {
    alert(data.error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      const user = jwt.decode(token);
      console.log('Decoded User:', user);
      if (!user) {
        console.log('Invalid token, removing token and redirecting to login');
        localStorage.removeItem('token');
        router.replace('/login');
      } else {
        populateQuote();
      }
    } else {
      console.log('No token found, redirecting to login');
      router.replace('/login');
    }
  }, []);
async function updateQuote(e){
  e.preventDefault();
  const req = await fetch('http://localhost:1337/api/quote', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token'),
    },
    body:JSON.stringify({quote:tempQuote})
  });
  const data = await req.json();
  if (data.status === 'ok') {
    setTempQuote('');
    setQuote(data.quote);
  } else {
  alert(data.error)
  }
}
  return (
    <div>
      <h1>Dashboard</h1>
      <p>your quote: {quote||'no quote found'}</p>
      <form onSubmit={updateQuote}>
        <input type='text' placeholder='quote' value={tempQuote} onChange={(e)=>setTempQuote(e.target.value)}/>
        <input type='submit' value='Update Quote'/>
      </form>
    </div>
  );
};

export default Dashboard;