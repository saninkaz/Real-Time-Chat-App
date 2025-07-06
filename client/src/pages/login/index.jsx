import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../api/auth";
import toast from "react-hot-toast"
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

export default function Login() {
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login submitted:", user);
        try {
            dispatch(showLoader());
            const response = await loginUser(user);
            dispatch(hideLoader());
            if (response.success) {
                toast.success(response.message);
                localStorage.setItem('token', response.token);
                window.location.href='/';
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            return error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Login to Your Account
                </h2>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={user.password}
                        onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Login
                </button>

                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    );
}
