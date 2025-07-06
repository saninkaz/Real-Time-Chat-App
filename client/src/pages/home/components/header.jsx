import React from 'react'
import { useSelector } from 'react-redux';

export default function Header() {
  const { user } = useSelector(state => state.userReducer)

  const userInitials = () => {
    let f = user?.firstname.toUpperCase()[0];
    let l = user?.lastname.toUpperCase()[0];
    return f + l;
  }

  const formatName = (user) => {
    const firstname = user?.firstname.at(0).toUpperCase() + user?.firstname.slice(1).toLowerCase()
    const lastname = user?.lastname.at(0).toUpperCase() + user?.lastname.slice(1).toLowerCase()
    return firstname + ' ' + lastname;
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="flex items-center space-x-3 text-xl font-semibold">
        <i className="fa-solid fa-helmet-safety" aria-hidden="true"></i>
        <span>GoChat</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm font-medium">{formatName(user)}</div>
          <div className="text-xs text-blue-200">Online</div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold shadow-inner">
          {userInitials()}
        </div>
      </div>
    </header>
  );
}

