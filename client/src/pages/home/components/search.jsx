import React from 'react';

export default function Search({searchName,setSearchName}) {
  return (
    <div className="hidden md:flex items-center bg-white rounded-lg shadow-sm px-3 py-2 w-full mb-4 border border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-400">
      <input
        type="text"
        placeholder="Search"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <i className="fa fa-search text-indigo-600 text-lg" aria-hidden="true"></i>
    </div>
  );
}
