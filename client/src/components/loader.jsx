import React from 'react'

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-fast"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
            </div>
        </div>

    );
}
