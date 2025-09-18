import { _routes, axiosInstance } from "./axios.js";

export const signup = async (signupData) => {
    const response = await axiosInstance.post(_routes.auth.signup, signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post(_routes.auth.login, loginData);
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post(_routes.auth.logout);
    return response.data;
}

export const getAuthUser = async () => {
    try {
        const response = await axiosInstance.get(_routes.auth.me);
        return response.data;
    } catch (error) {
        console.log("Error in AuthUser : ", error);
        return null
    }
}

export const completeOnboarding = async (userData) => {
    const response = await axiosInstance.post(_routes.auth.onboarding, userData);
    return response.data;
}

export const getUsersFriends = async () => {
    const response = await axiosInstance.get(_routes.user.get_friends);
    return response.data;
}

export const getRecomendedUsers = async () => {
    const response = await axiosInstance.get(_routes.user.get_user);
    return response.data;
}

export const getOutgoingFriendRequest = async () => {
    const response = await axiosInstance.get(_routes.user.get_outgoing_friend_request);
    return response.data;
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`${_routes.user.post_friend_request}/${userId}`);
    return response.data;
}


export const getFriendRequest = async () => {
    const response = await axiosInstance.get(`${_routes.user.get_friend_request}`);
    return response.data;
}

export const accetFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`${_routes.user.put_friend_request}/${requestId}/accept`);
    return response.data;
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get(`${_routes.chat.chats}`);
    return response.data;
}