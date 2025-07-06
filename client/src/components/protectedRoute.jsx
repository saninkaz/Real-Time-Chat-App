import React from 'react'
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, getUserDetails } from '../api/users'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../redux/loaderSlice'
import { setAllChats, setAllUsers, setUser } from '../redux/userSlice'
import toast from 'react-hot-toast'
import { getExistingChats } from '../api/chats'

export default function ProtectedRoute({ children }) {

    // const { allChats } = useSelector(state => state.userReducer)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const fetchUser = useCallback(async () => {
        try {
            dispatch(showLoader());
            const response = await getUserDetails();
            dispatch(hideLoader());
            if (response.success) {
                dispatch(setUser(response.data))
            }
            else {
                toast.error(response.message);
                navigate('/login')
            }
        } catch (error) {
            dispatch(hideLoader());
            navigate('/login')
        }
    }, [dispatch, navigate])

    const fetchAllUsers = useCallback(async () => {
        try {
            dispatch(showLoader());
            const response = await getAllUsers();
            dispatch(hideLoader());
            if (response.success) {
                dispatch(setAllUsers(response.data));
            }
            else {
                toast.error(response.message);
                navigate('/login')
            }
        } catch (error) {
            dispatch(hideLoader());
            navigate('/login')
        }
    }, [dispatch, navigate])

    const fetchExistingChats = useCallback(async () => {

        try {
            dispatch(showLoader());
            const response = await getExistingChats();
            dispatch(hideLoader());
            if (response.success) {
                dispatch(setAllChats(response.data));
            }
            else {
                toast.error(response.message);
                navigate('/login')
            }
        } catch (error) {
            dispatch(hideLoader());
            navigate('/login')
        }

    }, [dispatch, navigate])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchUser();
            fetchAllUsers();
            fetchExistingChats();
        } else {
            navigate('/login');
        }
    }, [fetchUser, fetchAllUsers, fetchExistingChats, navigate])

    return (
        <div>
            {/* <p className=''> HI {user?.firstname + ' ' + user?.lastname}</p> */}
            {children}
        </div>
    )
}
