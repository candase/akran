import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [lastJoined, setLastJoined] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [userSearchList, setUserSearchList] = useState([]);

    useEffect(() => {
        axios.get("/getLastJoinedUsers").then((result) => {
            setLastJoined(result.data);
        });

        let abort;
        if (userSearch) {
            (async () => {
                const { data } = await axios.post(`/userSearch`, {
                    userSearch,
                });
                if (!abort) {
                    setUserSearchList(data);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [userSearch]);

    return (
        <div id="findPeople">
            {!userSearch && (
                <div className="otherProfiles">
                    <h3>Akran&apos;a katılan son 3 kullanıcı:</h3>

                    {lastJoined.map((each) => (
                        <Link key={each.id} to={`/user/:${each.id}`}>
                            <div className="otherP">
                                <img
                                    className="findProfile"
                                    src={each.profile_pic}
                                />

                                <h3 className="findPeople">
                                    {each.firstname} {each.lastname}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <p>Kullanıcı bul:</p>
            <input
                id="userSearch"
                onChange={(e) => {
                    setUserSearch(e.target.value);
                }}
                placeholder="örn: Ahmet"
            />
            {userSearch && userSearchList.length == 0 && (
                <h3 className="findPeople">
                    Maalesef bu isimde bir kullanıcı yok.
                </h3>
            )}
            {userSearch && userSearchList.length > 0 && (
                <div className="otherProfiles">
                    {userSearchList.map((each) => (
                        <Link key={each.id} to={`/user/:${each.id}`}>
                            <div className="otherP">
                                <img
                                    className="findProfile"
                                    src={each.profile_pic}
                                />

                                <h3 className="findPeople">
                                    {each.firstname} {each.lastname}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
