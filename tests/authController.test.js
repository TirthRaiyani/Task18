const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../app'); // Your Express app
// const User = require('../models/User');

describe('Auth Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/task18');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a user', async () => {
        const res = await request(app).post('/api/register').send({
            userName: 'User',
            password: 'user123',
            isAdmin: 2
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
    });

    it('should login a user', async () => {
        const res = await request(app).post('/api/login').send({
            userName: 'User',
            password: 'user123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });
});
