import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat(props) {
    const elemRef = useRef();
    const commonChatMessages = useSelector(
        (state) => state && state.commonMessages
    );

    const keyCheck = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();

            socket.emit("newCommonMessage", e.target.value);
            e.target.value = "";
        }
    };

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [commonChatMessages]);

    return (
        <div id="chat">
            <h3 id="chat">Sohbet Odası</h3>
            <div id="chatContainer" ref={elemRef}>
                {commonChatMessages.map((each) => (
                    <div key={each.message_id} className="message">
                        <Link to={`/user/:${each.id}`}>
                            <img className="message" src={each.profile_pic} />
                        </Link>
                        <div className="messageText">
                            <p className="message">{each.message}</p>
                            <div className="messageSender">
                                <p className="messageSender">
                                    {each.firstname} {each.lastname},
                                </p>
                                <p className="date"> {each.created_at}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <textarea
                placeholder="Mesajınızı buraya yazın"
                id="message"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
