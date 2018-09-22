const request = require('supertest');
const app = require('../app');

describe('Index page', () => {
    it('should render successfully', done => {
        request(app).get('/').expect(200, done);
    });
});

describe('Art API', () => {
    describe('GET art data', () => {
        it('should return data of art', done => {
            request(app).get('/v1/art/10000002').expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.title.en === 'Aristotle with a Bust of Homer')
                .end(done);
        });
        it('should report invalid id', done => {
            request(app).get('/v1/art/1000002').expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });
        it('should report invalid username', done => {
            request(app).get('/v1/art/as').expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
});
