import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
      <h1 className="text-5xl font-bold text-black mb-8">User Authentication</h1>
      <div className="flex space-x-4">
        <Link href="/register" legacyBehavior>
          <a className="bg-white hover:bg-gray-200 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
            Register
          </a>
        </Link>
        <Link href="/login" legacyBehavior>
          <a className="bg-white hover:bg-gray-200 text-green-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
            Login
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;