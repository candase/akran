import axios from "./axios";

export async function receiveFriendsList() {
    const { data } = await axios.get("/getFriendsList");
    return {
        type: "GET_FRIENDS_LIST",
        friendsList: data,
    };
}

export async function deleteFriend(id) {
    await axios.post(`/end-friendship/:${id}`);
    return {
        type: "DELETE_FRIEND",
        id,
    };
}

export async function acceptFriend(id) {
    await axios.post(`/accept-friend-request/:${id}`);
    return {
        type: "ACCEPT_FRIEND",
        id,
    };
}

export async function denyFriendRequest(id) {
    await axios.post(`/deny-friend-request/:${id}`);
    return {
        type: "ACCEPT_FRIEND",
        id,
    };
}

export function chatMessages(msg) {
    return {
        type: "LAST_TEN_COMMON_MESSAGES",
        msg,
    };
}

export function newChatMessage(msg) {
    return {
        type: "ADD_NEW_COMMON_MESSAGE",
        msg,
    };
}
