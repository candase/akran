import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errorInLogin: false,
        };
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
    login(e) {
        e.preventDefault();
        let self = this;
        let userInfo = {
            email: this.state.email,
            password: this.state.password,
        };
        axios
            .post("/login", userInfo)
            .then((response) => {
                console.log(response);
                if (response.data.error) {
                    self.setState({
                        errorInLogin: true,
                    });
                } else {
                    self.setState({
                        errorInLogin: false,
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
                {this.state.errorInLogin ? (
                    <p className="errorMessage">
                        Birseyler yanlis gitti! Lutfen girdiğiniz bilgileri
                        kontrol edip tekrar deneyiniz.
                    </p>
                ) : (
                    <p></p>
                )}
                <form>
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
                        value="Giriş yap!"
                        onClick={(e) => this.login(e)}
                    />
                </form>
                <Link to="/resetPassword">
                    Parolanızı unuttuysanız buradan değiştirebilirsiniz.
                </Link>
                <p />
                <Link to="/">Üye değilseniz buradan kayıt olabilirsiniz.</Link>
            </div>
        );
    }
}
