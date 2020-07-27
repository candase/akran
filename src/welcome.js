import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";

import { HashRouter, Route } from "react-router-dom";

export default function Welcome(props) {
    return (
        <div className="welcome">
            <img src="./img/akranv1-01.png" />
            <h1>Hoş geldiniz!!</h1>
            <p>
                Aman da ne guzel bir anlatma yeri, bu site tam size gore cok
                guzel ve cok ozel falan.
            </p>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/resetPassword" component={ResetPassword} />
                </div>
            </HashRouter>
            <footer>© akran 2020</footer>
        </div>
    );
}
