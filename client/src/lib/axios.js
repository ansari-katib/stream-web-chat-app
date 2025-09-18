import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_API}/api`,
    withCredentials: true,
})


const type = {
    auth: "auth",
    users: "users",
    chats: "chat",
}

//  all enpoints : 
export const _routes = {

    auth: {
        signup: `${type.auth}/signup`,
        login: `${type.auth}/login`,
        logout: `${type.auth}/logout`,
        onboarding: `${type.auth}/onboarding`,
        me: `${type.auth}/me`,
    },

    user: {
        get_user: `${type.users}/`,
        get_friends: `${type.users}/friends`,
        post_friend_request: `${type.users}/friend-request`,
        put_friend_request: `${type.users}/friend-request`,       // this api for when user accept the request  = /:id/accept
        get_friend_request: `${type.users}/friend-requests`,
        get_outgoing_friend_request: `${type.users}/outgoing-friend-requests`,
    },

    chat: {
        chats: `${type.chats}/token`,
    },

}