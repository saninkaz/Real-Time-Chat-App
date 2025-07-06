import { axiosInstanceProtected } from "./index";

export const getExistingChats = async () => {
    try {
        const response = await axiosInstanceProtected.get('api/chat/get-all-chats');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const createNewChat = async (members) => {
    try {
        const response = await axiosInstanceProtected.post('api/chat/create-new-chat', { members });
        return response.data;
    } catch (error) {
        return error;
    }
}

export const clearUnreadMessageCount = async ( chatId ) => {
    try {
        const response = await axiosInstanceProtected.post('api/chat/clear-unread-message', { chatId });
        return response.data;
    } catch (error) {
        return error;
    }
}

