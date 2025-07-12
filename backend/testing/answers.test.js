// testing/answers.test.js
import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('Answer APIs', () => {
    let token, questionId, answerId;
    const suffix = Date.now();
    const testUser = {
        username: `answeruser_${suffix}`,
        email: `answeruser_${suffix}@example.com`,
        password: 'AnswerPass123!',
        name: 'Answer Tester'
    };

    const testQuestion = {
        title: 'What is the capital of Wakanda?',
        description: 'Need this for my geography paper.',
        tags: ["question", "marvel"]
    };

    const testAnswer = {
        content: 'This is a test answer.',
        userTagged: []
    };

    beforeAll(async () => {
        await mongoose.connect(`${process.env.MONGO_BASE_URI}/test_answers`);


        // Register and login
        await request(app).post('/api/v1/auth/register').send(testUser);
        const loginRes = await request(app).post('/api/v1/auth/login').send({
            email: testUser.email,
            password: testUser.password
        });
        token = loginRes.body.data.token;

        // Create question
        const questionRes = await request(app)
            .post('/api/v1/questions')
            .set('Authorization', `Bearer ${token}`)
            .send(testQuestion);
        // console.log(questionRes.body)
        questionId = questionRes.body.question._id;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should post an answer to a question and notify tagged users', async () => {
        const res = await request(app)
            .post('/api/v1/answers')
            .set('Authorization', `Bearer ${token}`)
            .send({
                questionId,
                content: testAnswer.content,
                userTagged: [testUser.username] // tag self to test notification logic
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Answer posted/i);
        expect(res.body.answer.question).toBe(questionId);
        answerId = res.body.answer._id;
    });

    it('should reply to an answer and notify tagged users', async () => {
        const replyContent = 'This is a reply to the test answer.';
        const res = await request(app)
            .post('/api/v1/answers/reply')
            .set('Authorization', `Bearer ${token}`)
            .send({
                answerId,
                content: replyContent,
                userTagged: [testUser.username]
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Reply added/i);
        expect(res.body.answer.replies.length).toBeGreaterThan(0);
    });
});
