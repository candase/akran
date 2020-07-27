import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            profilePicUrl: "",
        };
    }

    profilePicChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    profilePicUpload(e) {
        e.preventDefault();

        let self = this;
        var formData = new FormData();
        formData.append("file", self.state.file);

        axios.post("/uploadProfilePic", formData).then((result) => {
            self.props.setProfilePic(result.data.profile_pic);
            self.props.toggleUploader();
        });
    }

    render() {
        return (
            <div className="uploader">
                <p
                    className="closeModal"
                    onClick={() => this.props.toggleUploader()}
                >
                    x
                </p>
                <h3>
                    Profil fotoğrafınızı değiştirmek için yeni bir fotoğraf
                    seçin:
                </h3>
                <form id="profilePic">
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        id="file_uploader"
                        onChange={(e) => {
                            this.profilePicChange(e);
                        }}
                    />

                    <button
                        onClick={(e) => {
                            this.profilePicUpload(e);
                        }}
                    >
                        Fotoğrafı yükle!
                    </button>
                </form>
            </div>
        );
    }
}
