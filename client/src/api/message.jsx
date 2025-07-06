import { axiosInstanceProtected } from "./index";

export const createNewMessage = async (message) => {
    try {
        const response = await axiosInstanceProtected.post('api/message/new-message',message);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getAllMessages = async (chatId) => {
    try {
        const response = await axiosInstanceProtected.get(`api/message/get-all-messages/${chatId}`);
        return response.data;
    } catch (error) {
        return error;
    }
}