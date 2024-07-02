const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose')
// const Product = require('../models/Product');
const User = require('../models/User');
const { TokenExpiredError } = require('jsonwebtoken');


describe('Product Routes Test', () => {
    let token;
    let adminToken;
    let productId;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/task18');

        const user = new User({ userName: 'User', password: 'user123', isAdmin: 'user' });
        await user.save();
        const admin = new User({ userName: 'Admin', password: 'admin123', isAdmin: 'admin' });
        await admin.save();

        const userRes = await request(app).post('/api/auth/login').send({
            userName: 'User',
            password: 'user123'
        });
        token = userRes.body.accessToken;

        const adminRes = await request(app).post('/api/login').send({
            userName: 'Admin',
            password: 'admin123'
        });
        adminToken = adminRes.body.accessToken;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a product by admin', async () => {
        const res = await request(app)
            .post('/api/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                stock: 10
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        productId = res.body.data._id;
    });

    it('should not create a product by non-admin', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Product',
                description: 'Test Description',
                price: 100,
                stock: 10
            });
        expect(res.statusCode).toEqual(403);
    });

    it('should get all products', async () => {
        const res = await request(app).get('/api/getallproducts');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should update a product by admin', async () => {
        const res = await request(app)
            .put(`/api/updateproducts${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Product',
                description: 'Updated Description',
                price: 200,
                stock: 20
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.name).toBe('Updated Product');
    });

    it('should delete a product by admin', async () => {
        const res = await request(app)
            .delete(`/api/deleteproducts/${id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });
});
