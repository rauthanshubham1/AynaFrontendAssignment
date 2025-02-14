"use client";
import Navbar from "@/components/Navbar";
import MessageBox from "@/components/MessageBox";
import { MessageSquare, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ChatApp() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [chatAppJwt, setChatAppJwt] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("chat_app_jwt");
        setChatAppJwt(token);
    }, []);

    useEffect(() => {
        if (!chatAppJwt) return;

        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/me`, {
                    headers: { Authorization: `Bearer ${chatAppJwt}` },
                });
                setUserData(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUserData();
    }, [chatAppJwt]);

    useEffect(() => {
        if (!chatAppJwt || !userData) return;

        const fetchAllUsers = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`, {
                    headers: { Authorization: `Bearer ${chatAppJwt}` },
                });
                setAllUsers(res.data.filter(user => user.id !== userData.id));
                setFilteredUsers(res.data.filter(user => user.id !== userData.id));
            } catch (error) {
                console.error("Error fetching all users:", error.message);
            }
        };

        fetchAllUsers();
    }, [userData, chatAppJwt]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            setFilteredUsers(allUsers);
        } else {
            setFilteredUsers(
                allUsers.filter(user =>
                    user.username.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        }
    };

    const handleUserClick = (user) => {
        setSelectedChat(user);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar auth={true} />

            <div className="flex flex-1">
                {/* Sidebar */}
                {!selectedChat && (
                    <div className="w-full md:w-1/4 bg-white p-4 border-r border-gray-300">
                        <h2 className="text-lg font-bold text-black flex items-center gap-2">
                            <MessageSquare size={20} /> Chats
                        </h2>

                        {/* Search Box */}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="text"
                                placeholder="Search users by username"
                                className="w-full p-2 border rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* User List */}
                        <div className="mt-4 space-y-3">
                            {filteredUsers.length === 0 ? (
                                <p className="text-gray-500">No users found</p>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-2 bg-gray-200 rounded-lg text-black flex items-center gap-2 cursor-pointer"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <User size={16} /> {user.username}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Window */}
                {selectedChat ? (
                    <MessageBox
                        from={userData?.id}
                        to={selectedChat.id}
                        selectedChat={selectedChat.username}
                        onBack={() => setSelectedChat(null)}
                    />
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 text-lg font-semibold">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}
