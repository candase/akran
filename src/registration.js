import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            errorInRegistration: false,
        };
    }
    handleChangeFirstname(e) {
        this.setState({
            firstname: e.target.value,
        });
    }
    handleChangeLastname(e) {
        this.setState({
            lastname: e.target.value,
        });
    }
    handleChangeEmail(e) {
        this.setState({
            email: e.target.value,
        });
    }
    handleChangePassword(e) {
        this.setState({
            password: e.target.value,
        });
    }
    register(e) {
        e.preventDefault();
        let self = this;

        let userInfo = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
        };
        axios
            .post("/register", userInfo)
            .then((response) => {
                if (response.data.error) {
                    self.setState({
                        errorInRegistration: true,
                    });
                } else {
                    self.setState({
                        errorInRegistration: false,
                    });
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("error in axios.post at /register", err);
            });
    }
    render() {
        return (
            <div className="registerForm">
                {this.state.errorInRegistration ? (
                    <p className="errorMessage">
                        Birseyler yanlis gitti! Lutfen tekrar deneyiniz.
                    </p>
                ) : (
                    <p></p>
                )}
                <form>
                    <input
                        name="firstname"
                        placeholder="İsim"
                        onChange={(e) => this.handleChangeFirstname(e)}
                    />
                    <input
                        name="lastname"
                        placeholder="Soyisim"
                        onChange={(e) => this.handleChangeLastname(e)}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="e-posta"
                        onChange={(e) => this.handleChangeEmail(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="parola"
                        onChange={(e) => this.handleChangePassword(e)}
                    />
                    <input
                        type="submit"
                        value="Kaydol!"
                        onClick={(e) => this.register(e)}
                    />
                </form>
                <Link to="/login">Üyeyseniz buradan giriş yapabilirsiniz.</Link>
            </div>
        );
    }
}
