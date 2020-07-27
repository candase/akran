import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            profilePic: null,
            bio: null,
            noUser: false,
        };
    }

    componentDidMount() {
        let self = this;
        let userId = {
            userId: location.pathname.slice(7),
        };
        axios
            .post("/getUser", userId)
            .then((result) => {
                if (result.data.sameUser) {
                    self.props.history.push("/");
                } else {
                    if (result.data.noUser) {
                        self.setState({
                            noUser: true,
                        });
                    } else {
                        if (!result.data.profilePic) {
                            result.data.profilePic = "/img/profiledefault.png";
                        }

                        if (!result.data.bio) {
                            result.data.bio = "Hakkında bilgi yok";
                        }
                        self.setState({
                            firstname: result.data.firstname,
                            lastname: result.data.lastname,
                            profilePic: result.data.profilePic,
                            bio: result.data.bio,
                        });
                    }
                }
            })
            .catch((err) => {
                console.log("error in axios.post /getUser", err);
            });
    }

    render() {
        if (this.state.noUser) {
            return (
                <div>
                    <h3>Maalesef böyle bir kullancı yok.</h3>
                </div>
            );
        } else {
            return (
                <div className="profile">
                    <div className="otherProfile">
                        <div className="profilePic">
                            <img id="bigProfile" src={this.state.profilePic} />
                            <FriendButton
                                friendId={location.pathname.slice(7)}
                            />
                        </div>
                        <div className="otherBio">
                            <h3 id="profileEditBio">
                                {this.state.firstname} {this.state.lastname}
                            </h3>
                            <div id="bio">
                                <p id="hakkinda">Hakkında:</p>
                                <p id="bio">{this.state.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
