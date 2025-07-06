import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createNewMessage, getAllMessages } from '../../../api/message';
import { hideLoader, showLoader } from '../../../redux/loaderSlice';
import { clearUnreadMessageCount } from '../../../api/chats';
import store from './../../../redux/store'
import { setAllChats } from '../../../redux/userSlice';

export default function Chat({ socket }) {
  const { selectedChat, user: loggedUser, allChats } = useSelector((state) => state.userReducer);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const selectedUser = selectedChat.members.find(member => member._id !== loggedUser._id);

  const dispatch = useDispatch();

  const formatDate = () => {
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  const handleSendMessage = async () => {

    try {
      setNewMessage('');
      if (newMessage.trim() === '') return;

      socket.emit("send-message", {
        chatId: selectedChat._id,
        sender: loggedUser._id,
        text: newMessage,
        members: selectedChat.members.map((member) => member._id),
        read: false,
        createdAt: formatDate()
      })

      const response = await createNewMessage({ chatId: selectedChat._id, sender: loggedUser._id, text: newMessage });
      if (response.success) {
        toast.success(response.message);
      }
      else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error("Error occured while sending message");
      return error;
    }
  };


  const fetchAllMessages = useCallback(async () => {

    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        setMessages(response.data);
      }
      else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error("Error occured while fetching messages");
      return error;
    }
  }, [dispatch, selectedChat]);

  const formatName = (user) => {
    const firstname = user?.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase()
    const lastname = user?.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase()
    return firstname + ' ' + lastname;
  }

  const formatTime = (timestamp) => {

    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday = messageDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    let dateLabel;
    if (isToday) {
      dateLabel = 'Today';
    } else if (isYesterday) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = messageDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); // e.g. Apr 23
    }

    const timeLabel = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateLabel} ${timeLabel}`
  }

  const clearUnreadMessageCountFunction = useCallback(async () => {
    try {

      socket.emit('clear-unread-messages', {
        chatId: selectedChat._id,
        members: selectedChat.members.map((member => member._id))
      })
      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response.success) {
        toast.success(response.message);
        allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        })
      }
      else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error(error.message);
      return error;
    }
  }, [selectedChat, allChats, socket])

  useEffect(() => {
    fetchAllMessages();
    if (selectedChat?.lastMessage?.sender !== loggedUser._id) {
      clearUnreadMessageCountFunction();
    }

    socket.on("receive-message", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat
      if (selectedChat?._id === message.chatId) {
        setMessages((prev) => [...prev, message])
        if (message.sender !== loggedUser._id) {
          clearUnreadMessageCountFunction();
        }
      };
    })

    socket.on("cleared-message-count", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat
      const allChats = store.getState().userReducer.allChats

      if (selectedChat._id === data.chatId) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === data.chatId) {
            const updatedChat = {
              ...chat,
              unreadMessageCount: 0
            }
            return updatedChat
          }
          return chat;
        })
        dispatch(setAllChats(updatedChats));

        setMessages((prev) => {
          return prev.map((message) => {
            return {
              ...message,
              read: true
            }
          })
        })
      }
    })

  }, [selectedChat])



  useEffect(() => {
    const messageContainer = document.getElementById('chat-area')
    messageContainer.scrollTop = messageContainer.scrollHeight
  }, [messages])

  return (
    <div className="flex justify-center flex-1 p-6 ">
      {selectedChat ? (
        <div className="w-full max-w-5xl h-[75vh] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 text-lg font-semibold">
            {
              formatName(selectedUser)
              || 'Chat'}
          </div>


          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 scrollbar-custom" id='chat-area'>
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center mt-4">No messages yet</div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`w-fit max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === loggedUser._id
                    ? 'ml-auto bg-blue-600 text-white rounded-tr-none'
                    : 'mr-auto bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                  <div className="text-xs mt-1 text-right opacity-70 ">
                    {formatTime(msg.createdAt)} {msg.sender === loggedUser._id
                      && msg.read
                      && <i className='fa fa-check-circle ml-1' aria-hidden="true"></i>}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-4 flex gap-2 bg-white">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-110 transition"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-xl font-medium">Select a user to start chatting</div>
      )}
    </div>
  );
}
