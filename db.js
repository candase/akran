const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/akran`);
}

exports.insertUser = (firstname, lastname, email, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstname, lastname, email, password]
    );
};

exports.getUser = (email) => {
    return db.query(
        `
        SELECT * FROM users
        WHERE email = $1
        `,
        [email]
    );
};

exports.getUserbyId = (id) => {
    return db.query(
        `
        SELECT * FROM users
        WHERE id=$1
        `,
        [id]
    );
};

exports.insertResetCode = (email, secret) => {
    return db.query(
        `
        INSERT INTO reset_codes (email, code) VALUES ($1, $2) 
        `,
        [email, secret]
    );
};

exports.checkResetCode = (email) => {
    return db.query(
        `
        SELECT * FROM reset_codes
        WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY id DESC
        LIMIT 1
        `,
        [email]
    );
};

exports.updatePassword = (email, pass) => {
    return db.query(
        `
        UPDATE users SET password=$2
        WHERE email=$1
        `,
        [email, pass]
    );
};

exports.updateProfilePic = (id, img) => {
    return db.query(
        `
        UPDATE users SET profile_pic=$2
        WHERE id=$1
        RETURNING profile_pic
        `,
        [id, img]
    );
};

exports.updateBio = (id, bio) => {
    return db.query(
        `
        UPDATE users SET bio=$2
        WHERE id=$1
        RETURNING bio
        `,
        [id, bio]
    );
};

exports.getLastJoinedUsers = () => {
    return db.query(
        `
        SELECT id, firstname, lastname, profile_pic
        FROM users 
        ORDER BY id DESC 
        LIMIT 3
        `
    );
};

exports.userSearch = (name) => {
    return db.query(
        `SELECT id, firstname, lastname, profile_pic 
        FROM users 
        WHERE firstname ILIKE $1 OR lastname ILIKE $1
        ORDER BY firstname ASC, lastname ASC
        `,
        [name + "%"]
    );
};

exports.getFriendStatus = (myId, otherId) => {
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        `,
        [myId, otherId]
    );
};

exports.insertFriendReq = (myId, otherId) => {
    return db.query(
        `
        INSERT INTO friendships (sender_id , receiver_id ) VALUES ($1, $2)
        `,
        [myId, otherId]
    );
};

exports.acceptFriend = (myId, otherId) => {
    return db.query(
        `
        UPDATE friendships SET accepted= 't'
        WHERE receiver_id = $1 AND sender_id =$2 
        RETURNING *
        `,
        [myId, otherId]
    );
};

exports.deleteFriend = (myId, otherId) => {
    return db.query(
        `
        DELETE FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
        `,
        [myId, otherId]
    );
};

exports.getFriendsList = (id) => {
    return db.query(
        `
        SELECT users.id, firstname, lastname, profile_pic, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
        [id]
    );
};

exports.getLastTenCommonMessages = () => {
    return db.query(
        `
        SELECT users.id, common_chat.id AS message_id, firstname, lastname, profile_pic, message, common_chat.created_at
        FROM common_chat
        JOIN users on (sender_id = users.id)
        ORDER BY common_chat.created_at DESC
        LIMIT 10
        `
    );
};

exports.getLastCommonMessage = (id) => {
    return db.query(
        `
        SELECT users.id, common_chat.id AS message_id, firstname, lastname, profile_pic, message, common_chat.created_at
        FROM common_chat
        JOIN users on (sender_id = users.id AND sender_id = $1)
        ORDER BY common_chat.created_at DESC
        LIMIT 1
        `,
        [id]
    );
};

exports.insertCommonChat = (id, msg) => {
    return db.query(
        `
        INSERT INTO common_chat (sender_id, message) VALUES ($1, $2) RETURNING common_chat.id
        `,
        [id, msg]
    );
};

exports.deleteUser = (id) => {
    return db.query(
        `
        DELETE FROM users
        WHERE (users.id = $1)
        `,
        [id]
    );
};
