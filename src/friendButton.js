import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [friendId, setFriendId] = useState(props.friendId);
    const [buttonText, setButtonText] = useState("Arkadas butonu");
    const [friendStatus, setFriendStatus] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        if (friendStatus == null) {
            axios
                .post(`/make-friend-request/:${friendId}`)
                .then((result) => {
                    setFriendStatus("pending");
                    setButtonText("Arkadaşlık isteğini iptal et");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (buttonText == "Arkadaşlık isteğini kabul et") {
            axios
                .post(`/accept-friend-request/:${friendId}`)
                .then((result) => {
                    setFriendStatus("accepted");
                    setButtonText("Arkadaşlıktan çıkar");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        } else if (
            buttonText == "Arkadaşlık isteğini iptal et" ||
            buttonText == "Arkadaşlıktan çıkar"
        ) {
            axios
                .post(`/end-friendship/:${friendId}`)
                .then((result) => {
                    setFriendStatus(null);
                    setButtonText("Arkadaş olarak ekle");
                })
                .catch((err) => {
                    console.log("error in handleClick", err);
                });
        }
    };

    useEffect(() => {
        axios
            .get(`/get-initial-status/:${friendId}`)
            .then((result) => {
                if (
                    result.data.sender_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("Arkadaşlık isteğini kabul et");
                    setFriendStatus("pending");
                } else if (
                    result.data.receiver_id == friendId &&
                    !result.data.accepted
                ) {
                    setButtonText("Arkadaşlık isteğini iptal et");
                    setFriendStatus("pending");
                } else if (result.data.accepted) {
                    setButtonText("Arkadaşlıktan çıkar");
                    setFriendStatus("accepted");
                } else if (result.data.friendStatus == null) {
                    setButtonText("Arkadaş olarak ekle");
                }
            })
            .catch((err) => {
                console.log("error in /get-initial-status/", err);
            });
    }, [buttonText, friendStatus]);

    return (
        <div className="friendButton">
            <button onClick={(e) => handleClick(e)}>{buttonText}</button>
        </div>
    );
}
