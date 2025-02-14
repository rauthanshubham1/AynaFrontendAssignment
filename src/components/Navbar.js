"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';

const Navbar = ({ auth }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Check if the user is logged in based on JWT in localStorage
    useEffect(() => {
        const chat_app_jwt = localStorage.getItem("chat_app_jwt");
        if (chat_app_jwt) {
            setIsLoggedIn(true);  // User is logged in if JWT is present
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("chat_app_jwt");
        setIsLoggedIn(false);  // Set logged-in state to false
        router.push('/login');  // Redirect user to the login page after logout
    }

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-white font-bold text-2xl">
                    Ayna ChatApp
                </div>

                {/* Hamburger icon for mobile */}
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex space-x-6">
                    {
                        isLoggedIn
                            ?
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
                            >
                                Logout
                            </button>
                            :
                            <>
                                <Link href="/login">
                                    <p className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">Login</p>
                                </Link>
                                <Link href="/signup">
                                    <p className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300">SignUp</p>
                                </Link>
                            </>
                    }
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-gradient-to-r from-indigo-600 to-purple-600 p-4`}>
                <div className="flex flex-col space-y-4">
                    {
                        isLoggedIn
                            ?
                            <button
                                onClick={handleLogout}
                                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
                            >
                                Logout
                            </button>
                            :
                            <>
                                <Link href="/login">
                                    <p className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                                        Login
                                    </p>
                                </Link>
                                <Link href="/signup">
                                    <p className="text-white hover:bg-blue-500 px-4 py-2 rounded transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                                        SignUp
                                    </p>
                                </Link>
                            </>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
