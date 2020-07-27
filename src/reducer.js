export default function reducer(
    state = { friendsList: [], commonMessages: [], onlineUsers: [] },
    action
) {
    if (action.type == "GET_FRIENDS_LIST") {
        state = {
            ...state,
            friendsList: action.friendsList,
        };
    }

    if (action.type == "DELETE_FRIEND") {
        let newFriendsList = [];
        state.friendsList.map((each) => {
            if (each.id != action.id) {
                newFriendsList.push(each);
            }
        });
        state = {
            ...state,
            friendsList: newFriendsList,
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        let newFriendsList = [];
        state.friendsList.map((each) => {
            if (each.id == action.id) {
                each.accepted = true;
            }
            newFriendsList.push(each);
        });
        state = {
            ...state,
            friendsList: newFriendsList,
        };
    }

    if (action.type == "LAST_TEN_COMMON_MESSAGES") {
        state = {
            ...state,
            commonMessages: action.msg,
        };
    }

    if (action.type == "ADD_NEW_COMMON_MESSAGE") {
        state = {
            ...state,
            commonMessages: [...state.commonMessages, action.msg],
        };
    }

    return state;
}
