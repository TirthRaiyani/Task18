require('dotenv').config({ path: './.env' });

SECRET_KEY = process.env.SECRET_KEY;
PORT = 3000
DB_URL = process.env.DB_URL
DB_NAME = process.env.DB_NAME
module.exports = {
    SECRET_KEY,
    PORT,
    DB_URL,
    DB_NAME
}