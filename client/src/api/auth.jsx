import { axiosInstanceProtected } from "./index";

export const signupUser = async (user) => {
    try {
        const response = await axiosInstanceProtected.post('/api/auth/signup',user);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axiosInstanceProtected.post('/api/auth/login',user);
        return response.data;
    } catch (error) {
        return error;
    }
}