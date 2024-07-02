const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const app  = require('../app')

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/task18');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should hash the password before saving the user', async () => {
        const user = new User({ userName: 'User', password: 'user123', isAdmin: 'user' });
        await user.save();
        expect(await bcrypt.compare('user123', user.password)).toBe(true);
    });
});
