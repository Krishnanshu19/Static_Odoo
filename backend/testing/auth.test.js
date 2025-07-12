import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbName = 'test_auth';
const uri = `${process.env.MONGO_BASE_URI}/${dbName}`;

describe('Auth APIs', () => {
    let token;
    const suffix = Date.now();
    const testUser = {
        username: `testuser_${suffix}`,
        email: `testuser_${suffix}@example.com`,
        password: 'Password123!',
        name: 'Test User'
    };

    beforeAll(async () => {
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase(); // optional: clean test data
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const res = await request(app).post('/api/v1/auth/register').send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        token = res.body.data.token;
    });

    it('should not allow duplicate registration with same email/username', async () => {
        const res = await request(app).post('/api/v1/auth/register').send(testUser);
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/already (registered|taken)/i); // flexible match
    });

    it('should log in the registered user', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.token).toBeDefined();
        token = res.body.data.token;
    });

    it('should get the user profile with valid token', async () => {
        const res = await request(app)
            .get('/api/v1/auth/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.user.email).toBe(testUser.email);
    });
});
