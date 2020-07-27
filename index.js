const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `Super petition is awesome.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

const compression = require("compression");

const { hash, compare } = require("./bcrypt.js");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
let { s3Url } = require("./config.json");

const csurf = require("csurf");

/////File Upload//////

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(`${file.originalname}`));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//////////////////////

const {
    insertUser,
    getUser,
    getUserbyId,
    insertResetCode,
    checkResetCode,
    updatePassword,
    updateProfilePic,
    updateBio,
    getLastJoinedUsers,
    userSearch,
    getFriendStatus,
    insertFriendReq,
    acceptFriend,
    deleteFriend,
    getFriendsList,
    getLastTenCommonMessages,
    insertCommonChat,
    getLastCommonMessage,
    deleteUser,
} = require("./db");

app.use(compression());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use((req, res, next) => {
    const date = new Date();
    console.log(`
------------------------------------------------
    method: ${req.method} 
    url: ${req.url}
    user: ${req.session.userId}
    at: ${date.toUTCString()}
------------------------------------------------
    `);
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        // if the user is logged in...
        res.redirect("/");
    } else {
        // the user is NOT logged in...
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", (req, res) => {
    let error = {
        error: true,
    };
    if (req.session.userId) {
        getUserbyId(req.session.userId)
            .then((result) => {
                let userInfo = {
                    userId: req.session.userId,
                    firstname: result.rows[0].firstname,
                    lastname: result.rows[0].lastname,
                    profilePic: result.rows[0].profile_pic,
                    bio: result.rows[0].bio,
                };
                res.json(userInfo);
            })
            .catch((err) => {
                console.log("error in getUserbyId at /user", err);
                res.json(error);
            });
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/getLastJoinedUsers", (req, res) => {
    let error = {
        error: true,
    };
    getLastJoinedUsers()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(
                "error in getLastJoinedUsers at /getLastJoinedUsers",
                err
            );
            res.json(error);
        });
});

app.get("/get-initial-status/:id", (req, res) => {
    let error = {
        error: true,
    };
    getFriendStatus(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            if (result.rows.length == 0) {
                res.json({ friendStatus: null });
            } else {
                res.json(result.rows[0]);
            }
        })
        .catch((err) => {
            console.log(
                "error in getFriendStatus at /get-initial-status/:id",
                err
            );
            res.json(error);
        });
});

app.get("/getFriendsList", (req, res) => {
    let error = {
        error: true,
    };
    getFriendsList(req.session.userId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in getFriendsList at /getFriendsList", err);
            res.json(error);
        });
});

app.get("/deleteUser", s3.delete, (req, res) => {
    let error = {
        error: true,
    };
    console.log("req.session.userId:", req.session.userId);
    deleteUser(req.session.userId)
        .then((result) => {
            console.log(result.rows);
            req.session.userId = null;
            res.json();
        })
        .catch((err) => {
            console.log("error in deleteUser at /deleteUser:", err);
            res.json(error);
        });
});

app.post("/register", (req, res) => {
    let userPass = req.body.password;
    if (userPass == "") {
        userPass = null;
    }
    let userFirst = req.body.firstname;
    if (userFirst == "") {
        userFirst = null;
    }
    let userLast = req.body.lastname;
    if (userLast == "") {
        userLast = null;
    }
    let userEmail = req.body.email;
    if (userEmail == "") {
        userEmail = null;
    }
    let error = {
        error: true,
    };

    hash(userPass)
        .then((hashedUserPass) => {
            insertUser(userFirst, userLast, userEmail, hashedUserPass)
                .then((result) => {
                    req.session.userId = result.rows[0].id;
                    res.json();
                })
                .catch((err) => {
                    console.log("error in insertUser at /register", err);
                    res.json(error);
                });
        })
        .catch((err) => {
            console.log("error in hash at /register", err);
            res.json(error);
        });
});

app.post("/login", (req, res) => {
    let userPass = req.body.password;
    if (userPass == "") {
        userPass = null;
    }
    let userEmail = req.body.email;
    if (userEmail == "") {
        userEmail = null;
    }
    let error = {
        error: true,
    };

    getUser(userEmail)
        .then((result) => {
            compare(userPass, result.rows[0].password)
                .then((match) => {
                    if (match) {
                        req.session.userId = result.rows[0].id;
                        res.json();
                    } else {
                        res.json(error);
                    }
                })
                .catch((err) => {
                    console.log("error in compare at /login", err);
                    res.json(error);
                });
        })
        .catch((err) => {
            console.log("error in getUser at /login", err);
            res.json(error);
        });
});

app.post("/password/reset/start", (req, res) => {
    let userEmail = req.body.email;
    if (userEmail == "") {
        userEmail = null;
    }
    let error = {
        error: true,
    };
    getUser(req.body.email)
        .then((result) => {
            if (result.rows.length == 0) {
                res.json(error);
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                insertResetCode(userEmail, secretCode)
                    .then(() => {
                        sendEmail(
                            userEmail,
                            "Akran Parola Değiştirme Kodu",
                            `Parola değiştirme kodunuz: ${secretCode}`
                        )
                            .then(() => {
                                res.json();
                            })
                            .catch((err) => {
                                console.log(
                                    "error in sendEmail at /password/reset/start",
                                    err
                                );
                                res.json(error);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in inserResetCode at /password/reset/start",
                            err
                        );
                        res.json(error);
                    });
            }
        })
        .catch((err) => {
            console.log("error in getUser at /password/reset/start", err);
            res.json(error);
        });
});

app.post("/password/reset/verify", (req, res) => {
    let userEmail = req.body.email;
    if (userEmail == "") {
        userEmail = null;
    }
    let userChangedPass = req.body.changedPassword;
    if (userChangedPass == "") {
        userChangedPass = null;
    }
    let userResetCode = req.body.resetCode;
    if (userResetCode == "") {
        userResetCode = null;
    }
    let error = {
        error: true,
    };

    checkResetCode(userEmail)
        .then((result) => {
            if (userResetCode == result.rows[0].code) {
                hash(userChangedPass)
                    .then((hashedUserPass) => {
                        updatePassword(userEmail, hashedUserPass)
                            .then(() => {
                                res.json({ passwordUpdated: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "error in updatePassword at /password/reset/verify",
                                    err
                                );
                                res.json(error);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in hash at /password/reset/verify",
                            err
                        );
                        res.json(error);
                    });
            } else {
                res.json(error);
            }
        })
        .catch((err) => {
            console.log(
                "error in checkResetCode at /password/reset/verify",
                err
            );
            res.json(error);
        });
});

app.post(
    "/uploadProfilePic",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        let error = {
            error: true,
        };
        const { filename } = req.file;
        const imageUrl = `${s3Url}${req.session.userId}/${filename}`;
        updateProfilePic(req.session.userId, imageUrl)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log(
                    "error in updateProfilePic at /updateProfilePic",
                    err
                );
                res.json(error);
            });
    }
);

app.post("/updateBio", (req, res) => {
    let error = {
        error: true,
    };
    updateBio(req.session.userId, req.body.newBio)
        .then((result) => {
            console.log(result.rows);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in updateBio at /updateBio", err);
            res.json(error);
        });
});

app.post("/getUser", (req, res) => {
    let error = {
        error: true,
    };

    let noUser = {
        noUser: true,
    };

    let sameUser = {
        sameUser: true,
    };

    if (req.body.userId == req.session.userId) {
        res.json(sameUser);
    } else {
        getUserbyId(req.body.userId)
            .then((result) => {
                if (result.rows.length == 0) {
                    res.json(noUser);
                } else {
                    let userInfo = {
                        firstname: result.rows[0].firstname,
                        lastname: result.rows[0].lastname,
                        profilePic: result.rows[0].profile_pic,
                        bio: result.rows[0].bio,
                    };
                    res.json(userInfo);
                }
            })
            .catch((err) => {
                console.log("error in getUserbyId at /getUser", err);
                res.json(error);
            });
    }
});

app.post("/userSearch", (req, res) => {
    let error = {
        error: true,
    };
    userSearch(req.body.userSearch)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in userSearch at /userSearch", err);
            res.json(error);
        });
});

app.post("/make-friend-request/:id", (req, res) => {
    let error = {
        error: true,
    };
    insertFriendReq(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            res.json();
        })
        .catch((err) => {
            console.log(
                "error in insertFriendReq at /make-friend-request/:id  ",
                err
            );
            res.json(error);
        });
});

app.post("/accept-friend-request/:id", (req, res) => {
    let error = {
        error: true,
    };
    acceptFriend(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            res.json();
        })
        .catch((err) => {
            console.log(
                "error in acceptFriend at /accept-friend-request/:id  ",
                err
            );
            res.json(error);
        });
});

app.post("/end-friendship/:id", (req, res) => {
    let error = {
        error: true,
    };
    deleteFriend(req.session.userId, req.params.id.slice(1))
        .then((result) => {
            res.json();
        })
        .catch((err) => {
            console.log("error in deleteFriend at /end-friendship:id  ", err);
            res.json(error);
        });
});

app.post("/logout", (req, res) => {
    req.session.userId = null;
    res.json();
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("Server is listening.");
});

io.on("connection", function (socket) {
    console.log(`socket id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    getLastTenCommonMessages()
        .then((result) => {
            io.sockets.emit("chatMessages", result.rows.reverse());
        })
        .catch((err) => {
            console.log("error in getLastTenCommonMessages at io.on", err);
        });

    socket.on("newCommonMessage", (newMsg) => {
        insertCommonChat(userId, newMsg)
            .then((result) => {
                getLastCommonMessage(userId)
                    .then((result) => {
                        io.sockets.emit("addNewCommonMessage", result.rows);
                    })
                    .catch((err) => {
                        console.log(
                            "error in getLastCommonMessage at socket.on(newCommonMessage)",
                            err
                        );
                    });
            })
            .catch((err) => {
                console.log(
                    "error in insertCommonMessage at socket.on(newCommonMessage)",
                    err
                );
            });
    });
});
