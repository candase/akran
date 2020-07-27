import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            profilePic: null,
            bio: null,
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        let self = this;
        axios.get("/user").then((result) => {
            let profilePic = result.data.profilePic;
            if (profilePic == null) {
                profilePic = "/img/profiledefault.png";
            }
            self.setState({
                userId: result.data.userId,
                firstname: result.data.firstname,
                lastname: result.data.lastname,
                profilePic: profilePic,
                bio: result.data.bio,
            });
        });
    }

    toggleUploader() {
        if (this.state.uploaderVisible) {
            this.setState({
                uploaderVisible: false,
            });
        } else {
            this.setState({
                uploaderVisible: true,
            });
        }
    }

    setProfilePic(newProfilePic) {
        this.setState({
            profilePic: newProfilePic,
        });
    }

    updateBio(newBio) {
        axios.post("/updateBio", { newBio: newBio }).then((result) => {
            this.setState({
                bio: result.data.bio,
            });
        });
    }

    logout(e) {
        e.preventDefault();
        axios
            .post("/logout")
            .then((result) => {
                location.replace("/");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <div className="userMenu">
                        <img id="smallLogo" src="/img/akranv1-01.png" />
                        <div id="userNav">
                            <Link to="/users" className="nav">
                                Akranlar
                            </Link>
                            <Link to="/chat" className="nav">
                                Sohbet
                            </Link>
                            <Link to="/friends" className="nav">
                                Arkadaşlar
                            </Link>
                            <button id="logout" onClick={(e) => this.logout(e)}>
                                Çıkış yap
                            </button>
                            <Link to="/">
                                <ProfilePic
                                    // firstname={this.state.firstname}
                                    // lastname={this.state.lastname}
                                    profilePic={this.state.profilePic}
                                    // toggleUploader={() => this.toggleUploader()}
                                />
                            </Link>
                        </div>
                    </div>
                    <div id="uploader">
                        {this.state.uploaderVisible && (
                            <Uploader
                                setProfilePic={(newProfilePic) =>
                                    this.setProfilePic(newProfilePic)
                                }
                                toggleUploader={() => this.toggleUploader()}
                            />
                        )}
                    </div>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <div className="profile">
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    profilePic={this.state.profilePic}
                                    bio={this.state.bio}
                                    toggleUploader={() => this.toggleUploader()}
                                    updateBio={(newBio) =>
                                        this.updateBio(newBio)
                                    }
                                />
                            </div>
                        )}
                    />
                    <Route path="/user/:id" component={OtherProfile} />
                    <Route
                        path="/chat"
                        render={() => <Chat userId={this.state.userId} />}
                    />
                    <Route
                        exact
                        path="/users"
                        render={(props) => (
                            <div className="findPeople">
                                <FindPeople
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            </div>
                        )}
                    />
                    <Route path="/friends" component={Friends} />
                </div>
            </BrowserRouter>
        );
    }
}
