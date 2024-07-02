require('dotenv').config({ path: './.env' });

SECRET_KEY = process.env.SECRET_KEY;
PORT = 3000

module.exports = {
    SECRET_KEY,

}