"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

function Signup() {
  const [userData, setUserData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const chat_app_jwt = localStorage.getItem("chat_app_jwt");
        if (!chat_app_jwt) return;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${chat_app_jwt}`,
          },
        });

        if (res.status === 200) {
          router.push(`/user/${res.data.id}`);
        }
      } catch (error) {
        console.log('An error occurred:', error.message);
      }
    };
    checkUser();
  }, []);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/local/register`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      if (res.status === 200) {
        console.log("User successfully registered");
        router.push("/login");
      } else {
        console.log("User registration failed");
      }
    } catch (err) {
      console.log("Error during registration:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar auth={false} />
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-black">Sign Up</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                onChange={handleChange}
                value={userData.email}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-black">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                onChange={handleChange}
                value={userData.username}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                onChange={handleChange}
                value={userData.password}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {loading && (
              <p className="mt-2 text-sm text-center text-gray-600">
                Signing Up, server can be inactive due to inactivity, it could take time.
              </p>
            )}

            <div className="mt-4 text-center">
              <p className="text-black">
                Already have an account? <Link href="/login" className="text-indigo-600">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
