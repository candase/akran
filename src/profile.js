import React, { useState, useEffect } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    const [userDelete, setUserDelete] = useState(false);

    const deleteUser = () => {
        axios.get("/deleteUser").then((result) => {
            console.log(result);
            location.replace("/");
        });
    };

    useEffect(() => {}, [userDelete]);

    return (
        <div className="profile">
            <div className="profileEdit">
                <ProfilePic
                    firstname={props.firstname}
                    lastname={props.lastname}
                    profilePic={props.profilePic}
                    toggleUploader={() => props.toggleUploader()}
                />
                <div className="profileEditBio">
                    <h3 id="profileEditBio">
                        Merhaba {props.firstname} {props.lastname}
                    </h3>
                    <BioEditor
                        bio={props.bio}
                        updateBio={(newBio) => props.updateBio(newBio)}
                    />
                    {!userDelete && (
                        <button
                            id="userDelete"
                            onClick={() => {
                                setUserDelete(true);
                            }}
                        >
                            Hesabı Sil
                        </button>
                    )}
                    {userDelete && (
                        <div id="userDeleteApprove">
                            <p>Hesabınızı silmek istediğinize emin misiniz?</p>
                            <button
                                id="deleteYes"
                                onClick={() => {
                                    deleteUser();
                                }}
                            >
                                Evet
                            </button>
                            <button
                                id="deleteNo"
                                onClick={() => {
                                    setUserDelete(false);
                                }}
                            >
                                Hayır
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
