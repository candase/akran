import * as io from "socket.io-client";

import { chatMessages, newChatMessage, onlineUsersListAdd } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            store.dispatch(chatMessages(msgs));
        });

        socket.on("addNewCommonMessage", (msg) => {
            store.dispatch(newChatMessage(msg[0]));
        });
    }
};
