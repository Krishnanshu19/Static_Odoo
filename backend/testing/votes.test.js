import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Vote APIs', () => {
    let token;
    let questionId;
    const suffix = Date.now();

    const testUser = {
        username: `voteuser_${suffix}`,
        email: `voteuser_${suffix}@example.com`,
        password: 'Password123!',
        name: 'Vote User'
    };

    const testQuestion = {
        title: 'Do votes work in space?',
        description: 'Trying to test gravitational pull on voting logic.',
        tags: ['space', 'vote']
    };

    beforeAll(async () => {
        await mongoose.connect(`${process.env.MONGO_BASE_URI}/test_votes`);

        // Register and login
        await request(app).post('/api/v1/auth/register').send(testUser);
        const res = await request(app).post('/api/v1/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });
        token = res.body.data.token;

        // Post a question
        const questionRes = await request(app)
            .post('/api/v1/questions')
            .set('Authorization', `Bearer ${token}`)
            .send(testQuestion);

        questionId = questionRes.body.question._id;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should upvote a question', async () => {
        const res = await request(app)
            .post('/api/v1/votes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                targetType: 'question',
                targetId: questionId,
                voteType: 'up'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/vote registered/i);
        expect(res.body.vote.voteType).toBe('up');
    });

    it('should change vote to downvote', async () => {
        const res = await request(app)
            .post('/api/v1/votes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                targetType: 'question',
                targetId: questionId,
                voteType: 'down'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.vote.voteType).toBe('down');
    });

    it('should reject invalid voteType', async () => {
        const res = await request(app)
            .post('/api/v1/votes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                targetType: 'question',
                targetId: questionId,
                voteType: 'sideways'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/invalid or missing/i);
    });
});
