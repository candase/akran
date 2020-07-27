const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

exports.hash = (password) => genSalt().then((salt) => hash(password, salt));

exports.compare = compare;
