import React from "react";

export default function ProfilePic(props) {
    if (!props.firstname) {
        return (
            <div className="profilePic">
                <img id="smallProfile" src={props.profilePic} />
            </div>
        );
    } else {
        return (
            <div className="profilePic">
                <img
                    id="bigProfile"
                    src={props.profilePic}
                    onClick={props.toggleUploader}
                />
            </div>
        );
    }
}
