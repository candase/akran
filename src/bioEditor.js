import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: null,
            draftBio: null,
            textAreaVisible: false,
        };
    }
    componentDidMount() {
        let self = this;
        if (this.props.bio == null) {
            self.setState({
                bio: null,
            });
        } else {
            self.setState({
                bio: self.props.bio,
                draftBio: self.props.bio,
            });
        }
    }

    toggleTextArea(e) {
        e.preventDefault();
        if (this.state.textAreaVisible) {
            this.setState({
                textAreaVisible: false,
            });
        } else {
            this.setState({
                textAreaVisible: true,
                draftBio: this.props.bio,
            });
        }
    }

    handleChangeDraftBio(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }

    render() {
        let self = this;
        if (this.props.bio && !this.state.textAreaVisible) {
            return (
                <div id="bioEditor">
                    <p id="hakkinda">Hakkında:</p>
                    <p id="bio">{this.props.bio}</p>
                    <button
                        id="bioEdit"
                        onClick={(e) => {
                            this.toggleTextArea(e);
                        }}
                    >
                        Düzenle
                    </button>
                </div>
            );
        } else {
            if (!this.state.textAreaVisible) {
                return (
                    <div id="bioEditor">
                        <p
                            id="bioEdit"
                            onClick={(e) => {
                                this.toggleTextArea(e);
                            }}
                        >
                            Biraz kendinizden bahsetmek için tıklayın!
                        </p>
                    </div>
                );
            } else {
                return (
                    <div id="bioEditor">
                        <textarea
                            id="textBioEdit"
                            name="draftBio"
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChangeDraftBio(e)}
                        ></textarea>

                        <button
                            id="buttonBioEdit"
                            onClick={(e) => {
                                this.toggleTextArea(e);
                                this.props.updateBio(self.state.draftBio);
                            }}
                        >
                            Kaydet!
                        </button>
                    </div>
                );
            }
        }
    }
}
