import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Question APIs', () => {
    let token;
    let questionId;
    const suffix = Date.now();

    const testUser = {
        username: `qtestuser_${suffix}`,
        email: `qtestuser_${suffix}@example.com`,
        password: 'Password123!',
        name: 'QTest User'
    };

    const testQuestion = {
        title: 'What is the capital of Wakanda?',
        description: 'Need this for my geography paper.',
        tags: ["question", "marvel"]
    };

    beforeAll(async () => {
        await mongoose.connect(`${process.env.MONGO_BASE_URI}/test_questions`);

        // Register user
        await request(app).post('/api/v1/auth/register').send(testUser);
        const res = await request(app).post('/api/v1/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });
        token = res.body.data.token;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should allow a user to post a question', async () => {
        const res = await request(app)
            .post('/api/v1/questions')
            .set('Authorization', `Bearer ${token}`)
            .send(testQuestion);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Question submitted successfully');
        expect(res.body.question.title).toBe(testQuestion.title);

        questionId = res.body.question._id;
    });
});
