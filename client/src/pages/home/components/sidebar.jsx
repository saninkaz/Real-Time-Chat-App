import React, { useState } from 'react'
// import { useEffect } from 'react';
import Search from './search';
import UsersList from './usersList';
// import { useSelector } from 'react-redux';

export default function Sidebar({ socket }) {

    // const { selectedChat } = useSelector(state => state.userReducer);

    const [searchName, setSearchName] = useState('');

    //  useEffect(() => {
    //     console.log(selectedChat) 
    // },[selectedChat])


    return (
        <div className="w-[25%] sm:w-[25%] md:w-[30%]  px-4 py-6 max-h-fit bg-gradient-to-b from-indigo-100 to-blue-50 rounded-xl shadow-md">
            <Search searchName={searchName} setSearchName={setSearchName} />
            <UsersList searchName={searchName} socket={socket} />
        </div>
    );
}
