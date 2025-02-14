// "use client";
// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { ArrowLeft, Send } from "lucide-react";
// import axios from "axios";

// const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}`);

// export default function MessageBox({ from, to, selectedChat, onBack }) {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");
//     const messagesEndRef = useRef(null); // Reference for auto-scrolling

//     useEffect(() => {
//         fetchMessages();
//         socket.emit("join", { from, to });

//         const handleMessage = (newMessage) => {
//             setMessages((prev) => [...prev, newMessage]);
//         };

//         socket.on("message", handleMessage);

//         return () => {
//             socket.off("message", handleMessage);
//         };
//     }, [from, to]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]); // Auto-scroll when messages change

//     const fetchMessages = async () => {
//         try {
//             const chat_app_jwt = localStorage.getItem("chat_app_jwt");
//             if (!chat_app_jwt) return;

//             const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/messages`, {
//                 headers: { Authorization: `Bearer ${chat_app_jwt}` },
//                 params: {
//                     filters: { $or: [{ from, to }, { from: to, to: from }] },
//                     sort: "createdAt:asc",
//                 },
//             });

//             if (res.status === 200) {
//                 setMessages(res.data.data);
//             }
//         } catch (error) {
//             console.error("Error fetching messages:", error.message);
//         }
//     };

//     const sendMessage = async () => {
//         const chat_app_jwt = localStorage.getItem("chat_app_jwt");
//         if (!input.trim()) return;
//         const newMessage = { from, to, message: input };

//         socket.emit("sendMessage", newMessage);

//         try {
//             await axios.post(
//                 `${process.env.NEXT_PUBLIC_BACKEND}/api/messages`,
//                 { data: newMessage },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${chat_app_jwt}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//         } catch (error) {
//             console.error("Error sending message:", error.message);
//         }

//         setInput("");
//     };

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     return (
//         <div className="flex flex-col h-full">
//             {/* Header (Fixed) */}
//             <div className="bg-white p-4 border-b border-gray-300 text-black font-semibold flex items-center gap-2">
//                 <button onClick={onBack}>
//                     <ArrowLeft size={20} />
//                 </button>
//                 Chat with {selectedChat}
//             </div>

//             {/* Messages (Scrollable) */}
//             <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50" style={{ maxHeight: "calc(100vh - 140px)" }}>
//                 {messages.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`p-2 max-w-xs rounded-lg text-black ${Number(msg.from) === from ? "bg-blue-200 ml-auto" : "bg-gray-300"
//                             }`}
//                     >
//                         {msg.message}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
//             </div>

//             {/* Input Box (Fixed) */}
//             <div className="p-4 bg-white border-t border-gray-300 flex">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none text-black"
//                     placeholder="Type a message..."
//                 />
//                 <button
//                     onClick={sendMessage}
//                     className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
//                 >
//                     <Send size={20} />
//                 </button>
//             </div>
//         </div>
//     );
// }
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { ArrowLeft, Send } from "lucide-react";
import axios from "axios";

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}`);

export default function MessageBox({ from, to, selectedChat, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        socket.emit("join", { from, to });

        const handleMessage = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        };

        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        };
    }, [from, to]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const chat_app_jwt = localStorage.getItem("chat_app_jwt");
            if (!chat_app_jwt) return;

            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/messages`, {
                headers: { Authorization: `Bearer ${chat_app_jwt}` },
                params: {
                    filters: { $or: [{ from, to }, { from: to, to: from }] },
                    sort: "createdAt:asc",
                },
            });

            if (res.status === 200) {
                setMessages(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error.message);
        }
    };

    const sendMessage = async () => {
        const chat_app_jwt = localStorage.getItem("chat_app_jwt");
        if (!input.trim()) return;
        const newMessage = { from, to, message: input };

        socket.emit("sendMessage", newMessage);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND}/api/messages`,
                {
                    data: newMessage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${chat_app_jwt}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("Error sending message:", error.message);
        }

        setInput("");
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header - Fixed */}
            <div className="bg-white p-4 border-b border-gray-300 text-black font-semibold flex items-center gap-2 sticky top-0 left-0 w-full z-10">
                <button onClick={onBack}>
                    <ArrowLeft size={20} />
                </button>
                Chat with {selectedChat}
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50  ">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 max-w-xs rounded-lg text-black ${Number(msg.from) === from ? "bg-blue-200 ml-auto" : "bg-gray-300"}`}
                    >
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box - Fixed */}
            <div className="flex p-4 bg-white border-t border-gray-300 fixed bottom-0 left-0 w-full z-10">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}