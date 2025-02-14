"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';

function Login() {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const chat_app_jwt = localStorage.getItem("chat_app_jwt")
                if (!chat_app_jwt) return;
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${chat_app_jwt}`,
                    },
                });
                if (res.status == 200) {
                    router.push(`/user/${res.data.id}`)
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
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios
                .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/local`, {
                    identifier: userData.email,
                    password: userData.password,
                })
            if (res.status == 200) {
                localStorage.setItem("chat_app_jwt", res.data.jwt);
                router.push(`/user/${res.data.user.id}`)
                console.log("User successfully logged in");
            } else {
                console.log("User login failed");
            }
        } catch (err) {
            alert("Invalid Credentials");
        }
    }

    return (
        <>
            <Navbar authx={false} />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>

                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                                value={userData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                                value={userData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Login
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-700">Don't have an account? <Link href="/signup" className="text-indigo-600">Sign up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
