import React, { useEffect } from 'react'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Chat from './components/chat'
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client'

const socket = io("http://localhost:5173")

export default function Home() {

    const { selectedChat, user } = useSelector((state) => state.userReducer);


    useEffect(() => {
        socket.connect();

        // socket.on("connect", () => {
        //     console.log("Socket client connection established successfully, Socket Id:", socket.id);
        // });

        if (user) {
            socket.emit('join-room', user?._id);
        }

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-indigo-100">
            <Header />
            {/* <div className="flex w-[90%] mx-auto my-8 px-6 py-6 bg-white rounded-xl shadow-md">
                <p className="text-gray-700 text-lg font-medium">
                    This is the home page
                </p>
            </div> */}
            <div className='flex my-5 mx-5'>
                <Sidebar socket={socket} />
                {selectedChat && < Chat socket={socket} />}
            </div>
        </div>
    )
}
