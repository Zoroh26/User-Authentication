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
      alert(data.error);
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

  async function updateQuote(e) {
    e.preventDefault();
    const req = await fetch('http://localhost:1337/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ quote: tempQuote }),
    });
    const data = await req.json();
    if (data.status === 'ok') {
      setTempQuote('');
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <p className="text-xl mb-4">Your quote: {quote || 'No quote found'}</p>
      <form onSubmit={updateQuote} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Update Quote:</label>
          <input
            type="text"
            placeholder="Enter your quote"
            value={tempQuote}
            onChange={(e) => setTempQuote(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            value="Update Quote"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default Dashboard;