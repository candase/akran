import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resetEmail: "",
            changedPassword: "",
            resetCode: "",
            errorInResetPassword: false,
            resetEmailSent: false,
            passwordChangeSuccess: false,
        };
    }
    handleChangeEmail(e) {
        this.setState({
            resetEmail: e.target.value,
        });
    }
    handleChangeResetCode(e) {
        this.setState({
            resetCode: e.target.value,
        });
    }
    handleChangeChangedPassword(e) {
        this.setState({
            changedPassword: e.target.value,
        });
    }
    sendPasswordResetEmail(e) {
        e.preventDefault();
        let self = this;
        this.setState({
            errorInResetPassword: false,
        });

        let userInfo = {
            email: self.state.resetEmail,
        };
        axios
            .post("/password/reset/start", userInfo)
            .then((response) => {
                console.log(response);
                if (response.data.error) {
                    self.setState({
                        errorInResetPassword: true,
                        resetEmailSent: false,
                    });
                } else {
                    self.setState({
                        resetEmailSent: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "error in axios.post at /password/reset/start",
                    err
                );
            });
    }
    changePassword(e) {
        e.preventDefault();
        let self = this;
        self.setState({
            errorInResetPassword: false,
        });

        let userInfo = {
            email: self.state.resetEmail,
            changedPassword: self.state.changedPassword,
            resetCode: self.state.resetCode,
        };
        axios
            .post("/password/reset/verify", userInfo)
            .then((result) => {
                if (result.data.passwordUpdated) {
                    self.setState({
                        passwordChangeSuccess: true,
                    });
                    console.log(
                        "self.state at changePassword in if block",
                        self.state
                    );
                } else {
                    self.setState({
                        errorInResetPassword: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "error in axios.post at /password/reset/verify",
                    err
                );
                self.setState({
                    errorInResetPassword: true,
                });
            });
    }
    getCurrentDisplay() {
        let self = this;

        if (!self.state.resetEmailSent) {
            return (
                <div className="registerForm">
                    <p>
                        Şifrenizi değiştirmek için e-posta adresinizi giriniz:
                    </p>
                    <form>
                        <input
                            type="email"
                            name="resetEmail"
                            value={self.state.resetEmail}
                            placeholder="e-posta"
                            onChange={(e) => self.handleChangeEmail(e)}
                        />
                        <input
                            type="submit"
                            value="Parola yenileme kodu gönder"
                            onClick={(e) => self.sendPasswordResetEmail(e)}
                        />
                    </form>
                </div>
            );
        } else if (
            !self.state.passwordChangeSuccess &&
            self.state.resetEmailSent
        ) {
            return (
                <div className="registerForm">
                    <p>
                        Parolanızı değiştirmek için e-postanıza gönderilen kodu
                        ve yeni parolanızı giriniz:
                    </p>
                    <form>
                        <input
                            name="resetCode"
                            value={self.state.resetCode}
                            placeholder="Parola yenileme kodu"
                            onChange={(e) => self.handleChangeResetCode(e)}
                        />
                        <input
                            type="password"
                            name="changedPassword"
                            value={self.state.changedPassword}
                            placeholder="Yeni Parola"
                            onChange={(e) =>
                                self.handleChangeChangedPassword(e)
                            }
                        />
                        <input
                            type="submit"
                            value="Parolamı değiştir"
                            onClick={(e) => self.changePassword(e)}
                        />
                    </form>
                </div>
            );
        } else if (self.state.passwordChangeSuccess) {
            return (
                <div className="registerForm">
                    <Link to="/login">
                        Parolanız değişti! Giriş yapmak için tıklayınız.
                    </Link>
                </div>
            );
        }
    }
    render() {
        return (
            <div className="registerForm">
                {this.state.errorInResetPassword ? (
                    <p className="errorMessage">
                        Birseyler yanlis gitti! Lutfen girdiğiniz bilgileri
                        kontrol edip tekrar deneyiniz.
                    </p>
                ) : (
                    <p></p>
                )}
                {this.getCurrentDisplay()}
            </div>
        );
    }
}
