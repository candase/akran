import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsList, deleteFriend, acceptFriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friendsAccepted = useSelector((state) =>
        state.friendsList.filter((each) => each.accepted == true)
    );
    const friendsPending = useSelector((state) =>
        state.friendsList.filter((each) => each.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveFriendsList());
    }, []);

    return (
        <div id="friends">
            <h3>Arkadaşlar</h3>
            {friendsAccepted.length == 0 && (
                <p>Maalesef henüz arkadaşınız yok.</p>
            )}
            {friendsAccepted && (
                <div id="friendsAccepted">
                    {friendsAccepted.map((each) => (
                        <div className="friendsProfiles" key={each.id}>
                            <Link to={`/user/:${each.id}`}>
                                <img
                                    className="friendsProfile"
                                    src={each.profile_pic}
                                />
                                <p className="friendProfiles">
                                    {each.firstname} {each.lastname}
                                </p>
                            </Link>
                            <button
                                onClick={() => dispatch(deleteFriend(each.id))}
                            >
                                Arkadaşlıktan çıkar
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <h3>Arkadaşlık istekleri</h3>
            {friendsPending.length == 0 && (
                <p>Şu anda bekleyen bir arkadaşlık isteğiniz yok.</p>
            )}
            {friendsPending && (
                <div id="friendsPending">
                    {friendsPending.map((each) => (
                        <div className="friendsProfiles" key={each.id}>
                            <Link to={`/user/:${each.id}`}>
                                <img
                                    className="friendsProfile"
                                    src={each.profile_pic}
                                />
                                <p className="friendProfiles">
                                    {each.firstname} {each.lastname}
                                </p>
                            </Link>
                            <button
                                onClick={() => dispatch(acceptFriend(each.id))}
                            >
                                Arkadaşlık isteğini onayla
                            </button>
                            <button
                                className="deny"
                                onClick={() => dispatch(deleteFriend(each.id))}
                            >
                                Arkadaşlık isteğini reddet
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
