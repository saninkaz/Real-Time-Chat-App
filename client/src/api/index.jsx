import axios from "axios";

export const axiosInstanceProtected = axios.create({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});