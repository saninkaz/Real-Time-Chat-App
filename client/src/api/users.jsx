import { axiosInstanceProtected } from "./index";

export const getUserDetails = async () => {
    try {
        const response = await axiosInstanceProtected.get('/api/user/get-logged-user');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getAllUsers = async () => {
     try {
        const response = await axiosInstanceProtected.get('/api/user/get-all-users');
        return response.data;
    } catch (error) {
        return error;
    }
}
