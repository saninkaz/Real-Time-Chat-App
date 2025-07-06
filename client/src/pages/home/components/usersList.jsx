import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createNewChat } from '../../../api/chats';
import { hideLoader, showLoader } from '../../../redux/loaderSlice';
import toast from 'react-hot-toast';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice';
import store from "./../../../redux/store"


export default function UsersList({ searchName, socket }) {

    const dispatch = useDispatch();

    const { allUsers, allChats, user: loggedUser, selectedChat } = useSelector(state => state.userReducer);
    const selectedUser = selectedChat?.members.find(member => member?._id !== loggedUser?._id);

    const createNewChatCall = async (user_id) => {

        try {
            dispatch(showLoader());
            const response = await createNewChat([loggedUser._id, user_id]);
            dispatch(hideLoader());
            if (response.success) {
                toast.success(response.message)
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChat(newChat));
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error);
        }
    }

    const openSelectedChat = async (user_id) => {

        const selectedChat = allChats.find(chat => {
            const members_ids = chat.members.map(member => member._id)
            return members_ids.includes(user_id) && members_ids.includes(loggedUser._id)
        })
        if (selectedChat) {
            dispatch(setSelectedChat(selectedChat));
        }
    }

    const getLastMessage = (user_id) => {
        const chat = allChats.find(chat => chat.members.map(member => member._id).includes(user_id));
        const timeLabel = new Date(chat?.lastMessage?.createdAt);

        if (chat && chat.lastMessage) {
            return <div className='flex justify-between'>
                <div>
                    {chat.lastMessage?.sender === loggedUser._id ? `You : ${chat.lastMessage?.text?.substring(0, 30) + '...'}` : chat.lastMessage?.text?.substring(0, 30) + `   ...`}
                </div>
                <div className='text-[13px] translate-y-1'>
                    {timeLabel.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        }
        return;
    }

    const userInitials = (user) => {
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }

    const formatName = (user) => {
        const firstname = user?.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
        const lastname = user?.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
        return firstname + ' ' + lastname;
    }

    const getUnreadMessageCount = (user) => {

        const chat = allChats.find(chat => chat.members.map((member) => member._id).includes(user._id));

        if (chat && chat.unreadMessageCount && chat.lastMessage.sender !== loggedUser._id) {
            return <div className="rounded-full bg-[#6060f0] flex items-center justify-center w-[22px] h-[22px] text-[#ffff28]">
                {chat.unreadMessageCount}
            </div>
        }
    }

    const getData = () => {
        if (searchName === "") {
            return allChats;
        }
        return allUsers.filter((user) => {
            const fullName = user.firstname + ' ' + user.lastname
            return (fullName.toLowerCase().includes(searchName.toLowerCase()) && searchName)
        })
    }
    

    useEffect(() => {

        socket.on("receive-message", (message) => {
            const selectedChat = store.getState().userReducer.selectedChat
            const allChats = store.getState().userReducer.allChats

            if (selectedChat?._id !== message.chatId) {
                const updatedChats = allChats.map((chat) => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            unreadMessageCount: (chat?.unreadMessageCount) ? chat.unreadMessageCount + 1 : 1,
                            lastMessage: message
                        }
                    }
                    return chat
                })
                dispatch(setAllChats(updatedChats));
            }
        })

    }, [socket,dispatch])

    // useEffect(() => {
    //     console.log(allChats);
    // }, [allChats])

    return (
        <div className='flex flex-col'>
            {getData()?.map((obj, index) => {
                let user = obj;
                if (obj.members) {
                    user = obj.members.find((member) => member._id !== loggedUser?._id)
                }
                return <div key={index}
                    onClick={() => { openSelectedChat(user._id) }}
                    className={`mb-4 p-4 rounded-lg shadow-md transition duration-200 cursor-pointer md:w-full sm:w-[65%] w-[65%] mx-auto
                    ${user._id === selectedUser?._id ? 'border-2 border-indigo-600 bg-blue-50' : 'bg-white hover:shadow-lg'}`}>

                    <div className="flex items-center space-x-5 justify-center">
                        {user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile Pic"
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                            />
                        ) : (
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg
                                ${user._id === selectedUser?._id ? `bg-[#b4b9ee] text-black` : `bg-gradient-to-br from-indigo-400 to-blue-500 text-white`}`}>
                                {userInitials(user)}
                            </div>
                        )}
                        <div className="flex-1 ml-4 hidden md:block">
                            <div className='flex justify-between'>
                                <div className="font-semibold text-gray-800">
                                    {formatName(user)}
                                </div>
                                {getUnreadMessageCount(user)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {getLastMessage(user._id) || user?.email}
                            </div>
                        </div>
                        {!allChats.find((chat) => {
                            return chat.members.some(member => member._id === user._id)
                        }) &&
                            <div className="hidden md:block">
                                <button onClick={() => createNewChatCall(user._id)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md text-sm hover:brightness-110 transition">
                                    Start Chat
                                </button>
                            </div>
                        }
                    </div>
                </div>
            }
            )}
        </div>
    )
}
