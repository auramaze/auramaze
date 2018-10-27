const request = require('supertest');
const app = require('../app');
const uuidv4 = require('uuid/v4');
const assert = require('assert');

/* eslint-disable no-console */

function randomUsername() {
    return uuidv4().replace(/^[-\d]+/, '').replace(/-+$/, '');
}

describe('Test router', () => {
    it('should render successfully', done => {
        request(app).get('/').expect(200, done);
    });
    it('should return 404', done => {
        request(app).get('/v0').expect(404, done);
    });
});

describe('Test api', function () {
    this.timeout(5000);
    describe('GET api', () => {
        describe('GET art data', () => {
            it('should get art data', done => {
                request(app).get('/v1/art/10000002')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.title.en === 'Aristotle with a Bust of Homer');
                    })
                    .end(done);
            });

            it('should not get empty data', done => {
                request(app).get('/v1/art/dummy')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === 'dummy');
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).get('/v1/art/1000002')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid username', done => {
                request(app).get('/v1/art/as')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report ART_NOT_FOUND', done => {
                request(app).get('/v1/art/00000000')
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ART_NOT_FOUND');
                    })
                    .end(done);
            });

            it('should report ART_NOT_FOUND', done => {
                request(app).get('/v1/art/notexist')
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ART_NOT_FOUND');
                    })
                    .end(done);
            });
        });

        describe('Batch GET art data', () => {
            it('should batch get art data', done => {
                request(app).post('/v1/art/batch')
                    .send({
                        'id': [10000002, 10000003]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body[10000002].title.en === 'Aristotle with a Bust of Homer');
                    })
                    .end(done);
            });

            it('should return empty object', done => {
                request(app).post('/v1/art/batch')
                    .send({
                        'id': []
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify({}));
                    })
                    .end(done);
            });

            it('should get empty data', done => {
                request(app).post('/v1/art/batch')
                    .send({
                        'id': [10000000, 10000003]
                    })
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.hasOwnProperty(10000000));
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).post('/v1/art/batch')
                    .send({
                        'id': [100000001]
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should not report ART_NOT_FOUND', done => {
                request(app).post('/v1/art/batch')
                    .send({
                        'id': [90000000]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify({}));
                    })
                    .end(done);
            });
        });

        describe('GET art relations', () => {
            it('should return related artizens of art', done => {
                request(app).get('/v1/art/10000003/artizen')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length >= 4 && res.body[3].type && res.body[3].data[0].id);
                    })
                    .end(done);
            });

            it('should return specified type of relations', done => {
                request(app).get('/v1/art/10000003/artizen?type=artist')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length === 1 && res.body[0].type === 'artist');
                    })
                    .end(done);
            });

            it('should return empty relations', done => {
                request(app).get('/v1/art/10000003/artizen?type=notexist')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length === 0);
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).get('/v1/art/1000003/artizen')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid username', done => {
                request(app).get('/v1/art/as/artizen')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should return empty array for nonexist id', done => {
                request(app).get('/v1/art/00000000/artizen')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify([]));
                    })
                    .end(done);
            });

            it('should return empty array for nonexist username', done => {
                request(app).get('/v1/art/notexist/artizen')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify([]));
                    })
                    .end(done);
            });

            it('should report invalid type', done => {
                request(app).get('/v1/art/10000003/artizen?type=123')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET artizen data', () => {
            it('should get artizen data by id', done => {
                request(app).get('/v1/artizen/100000011')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === 'metmuseum');
                    })
                    .end(done);
            });

            it('should get artizen data by username', done => {
                request(app).get('/v1/artizen/zianke')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(parseInt(res.body.id) === 100000001);
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).get('/v1/artizen/10000002').expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid username', done => {
                request(app).get('/v1/artizen/as').expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report ARTIZEN_NOT_FOUND', done => {
                request(app).get('/v1/artizen/000000000').expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ARTIZEN_NOT_FOUND');
                    })
                    .end(done);
            });

            it('should report ARTIZEN_NOT_FOUND', done => {
                request(app).get('/v1/artizen/notexist').expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ARTIZEN_NOT_FOUND');
                    })
                    .end(done);
            });
        });


        describe('Batch GET artizen data', () => {
            it('should batch get artizen data', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': [100000012, 100000013]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body[100000012].name.en === 'National Gallery of Art, Washington, DC, US');
                    })
                    .end(done);
            });

            it('should return empty object', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': []
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify({}));
                    })
                    .end(done);
            });

            it('should convert types to array', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': [100000012, 100000013]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body[100000012].type.length === 2);
                    })
                    .end(done);
            });

            it('should get empty data', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': [100000000, 100000003]
                    })
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.hasOwnProperty(100000000));
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': [10000001]
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should not report ART_NOT_FOUND', done => {
                request(app).post('/v1/artizen/batch')
                    .send({
                        'id': [900000000]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify({}));
                    })
                    .end(done);
            });
        });

        describe('GET artizen relations', () => {
            it('should return related arts of artizen', done => {
                request(app).get('/v1/artizen/metmuseum/art').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length && res.body[0].next);
                    })
                    .end(done);
            });

            it('should return specified type of relations', done => {
                request(app).get('/v1/artizen/metmuseum/art?type=museum').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length > 0);
                    })
                    .end(done);
            });

            it('should return empty relations', done => {
                request(app).get('/v1/artizen/metmuseum/art?type=artist').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length === 0);
                    })
                    .end(done);
            });

            it('should report invalid id', done => {
                request(app).get('/v1/artizen/10000001/art').expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid username', done => {
                request(app).get('/v1/artizen/as/art').expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should not report ARTIZEN_NOT_FOUND', done => {
                request(app).get('/v1/artizen/000000000/art').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify([]));
                    })
                    .end(done);
            });

            it('should not report ARTIZEN_NOT_FOUND', done => {
                request(app).get('/v1/artizen/notexist/art').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(JSON.stringify(res.body) === JSON.stringify([]));
                    })
                    .end(done);
            });
            it('should report invalid type', done => {
                request(app).get('/v1/artizen/10000003/art?type=123').expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET slide urls', () => {
            it('should get slide urls', done => {
                request(app).get('/v1/slide').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length > 1 && res.body.every(item => item.includes('https') && item.includes('s3') && item.includes('amazonaws')));
                    })
                    .end(done);
            });
        });
    });

    describe('PUT api', () => {
        describe('PUT artizen', () => {
            it('should put artizen data with username', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': username,
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{9}$/));
                    })
                    .end(() => {
                        request(app).get(`/v1/artizen/${username}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.name.default === 'This is name A' && !res.body.type);
                            })
                            .end(done);
                    });
            });

            it('should put artizen data with username and types', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name B', 'en': 'This is name B'},
                        'username': username,
                        'type': ['museum', 'exhibition']
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{9}$/));
                    })
                    .end(() => {
                        request(app).get(`/v1/artizen/${username}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.name.default === 'This is name B' && res.body.type.length === 2);
                            })
                            .end(done);
                    });
            });

            it('should put artizen data without username', done => {
                let id;
                request(app).put('/v1/artizen/000000000')
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(!res.body.username);
                        id = res.body.id;
                    })
                    .end(() => {
                        request(app).get(`/v1/artizen/${id}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.name.default === 'This is name A' && !res.body.type);
                            })
                            .end(done);
                    });
            });

            it('should report invalid url', done => {
                request(app).put('/v1/artizen/100000000')
                    .send({
                        'name': {'default': 'This is name B', 'en': 'This is name B'},
                        'type': ['museum', 'exhibition']
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should not have username', done => {
                const username = randomUsername();
                request(app).put('/v1/artizen/000000000')
                    .send({
                        'name': {'default': 'This is name B', 'en': 'This is name B'},
                        'username': username,
                        'type': ['museum', 'exhibition']
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid data with unequal usernames', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': randomUsername()
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid data without default name', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'en': 'This is name A'},
                        'username': username
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report duplicate username', done => {
                const username = 'nga';
                request(app).put('/v1/artizen/nga')
                    .send({
                        'name': {'default': 'NGA', 'en': 'NGA'},
                        'username': username
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.code === 'USERNAME_EXIST');
                    })
                    .end(done);
            });
        });

        describe('PUT art', () => {
            it('should put art data and relations', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                        'username': username,
                        'completion_year': 'c.1517',
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{9}$/) && res.body.completion_year === 'c.1517');
                    })
                    .end(() => {
                        request(app).get(`/v1/art/${username}/artizen`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.length === 3);
                                for (let item of res.body) {
                                    assert((item.type === 'artist' && item.data.length === 2) || (item.type === 'museum' && item.data.length === 1) || (item.type === 'exhibition' && item.data.length === 1 && parseInt(item.data[0].id) === 100000012));
                                }
                            })
                            .end(done);
                    });
            });

            it('should add to artizen type', done => {
                const artizenUsername = randomUsername();
                request(app).put(`/v1/artizen/${artizenUsername}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': artizenUsername,
                        'type': ['museum']
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(() => {
                        const artUsername = randomUsername();
                        request(app).put(`/v1/art/${artUsername}`)
                            .send({
                                'title': {'default': 'This is title A', 'en': 'This is title A'},
                                'username': artUsername,
                                'relations': [{'artizen': artizenUsername, 'type': 'exhibition'}]
                            })
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(() => {
                                request(app).get(`/v1/artizen/${artizenUsername}`)
                                    .expect(200)
                                    .expect('Content-Type', /json/)
                                    .expect(res => {
                                        assert(res.body.type.length === 2);
                                    })
                                    .end(() => {
                                        request(app).get(`/v1/artizen/${artizenUsername}/art`)
                                            .expect(200)
                                            .expect(res => {
                                                assert(res.body.length === 1);
                                            })
                                            .end(done);
                                    });
                            });
                    });
            });

            it('should not add to artizen type', done => {
                const artizenUsername = randomUsername();
                request(app).put(`/v1/artizen/${artizenUsername}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': artizenUsername,
                        'type': ['museum']
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(() => {
                        request(app).get(`/v1/artizen/${artizenUsername}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.type.length === 1);
                            })
                            .end(() => {
                                const artUsername = randomUsername();
                                request(app).put(`/v1/art/${artUsername}`)
                                    .send({
                                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                                        'username': artUsername,
                                        'relations': [{'artizen': artizenUsername, 'type': 'museum'}]
                                    })
                                    .expect(200)
                                    .expect('Content-Type', /json/)
                                    .end(() => {
                                        request(app).get(`/v1/artizen/${artizenUsername}`)
                                            .expect(200)
                                            .expect('Content-Type', /json/)
                                            .expect(res => {
                                                assert(res.body.type.length === 1);
                                            })
                                            .end(() => {
                                                request(app).get(`/v1/artizen/${artizenUsername}/art`)
                                                    .expect(200)
                                                    .expect(res => {
                                                        assert(res.body.length === 1);
                                                    })
                                                    .end(done);
                                            });
                                    });
                            });
                    });
            });

            it('should put art data without username', done => {
                let id;
                request(app).put('/v1/art/00000000')
                    .send({
                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(!res.body.username);
                        id = res.body.id;
                    })
                    .end(() => {
                        request(app).get(`/v1/art/${id}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.title.default === 'This is title A');
                            })
                            .end(done);
                    });
            });

            it('should report invalid url', done => {
                request(app).put('/v1/art/10000000')
                    .send({
                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should not have username', done => {
                const username = randomUsername();
                request(app).put('/v1/art/00000000')
                    .send({
                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                        'username': username,
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report USERNAME_EXIST', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title A', 'en': 'This is title A'},
                        'username': username,
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(200)
                    .end(() => {
                        request(app).put(`/v1/art/${username}`)
                            .send({
                                'title': {'default': 'This is title A', 'en': 'This is title A'},
                                'username': username,
                                'relations': [
                                    {'artizen': 'nga', 'type': 'museum'},
                                    {'artizen': 'nga', 'type': 'exhibition'},
                                    {'artizen': 'caravaggio', 'type': 'artist'},
                                    {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                            })
                            .expect(400)
                            .end(done);
                    });
            });

            it('should report invalid title', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'en': 'This is title B'},
                        'username': username,
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid username', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title B', 'en': 'This is title B'},
                        'username': randomUsername(),
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid relation', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title C', 'en': 'This is title C'},
                        'username': username,
                        'relations': []
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid relation', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title D', 'en': 'This is title D'},
                        'username': username,
                        'relations': [
                            {'artizen': '1234', 'type': 'museum'},
                            {'artizen': 'nga', 'type': '5678'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report RELATED_ARTIZEN_NOT_FOUND', done => {
                const username = randomUsername();
                request(app).put(`/v1/art/${username}`)
                    .send({
                        'title': {'default': 'This is title E', 'en': 'This is title E'},
                        'username': username,
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'notexist', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'RELATED_ARTIZEN_NOT_FOUND');
                    })
                    .end(done);
            });
        });
    });

    describe('DELETE api', () => {
        describe('DELETE artizen', () => {
            it('should not found deleted artizen', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': username,
                        'type': ['museum', 'exhibition']
                    })
                    .expect(200)
                    .end(() => {
                        request(app).delete(`/v1/artizen/${username}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(() => {
                                request(app).get(`/v1/artizen/${username}`)
                                    .expect(404)
                                    .expect(res => {
                                        assert(res.body.code === 'ARTIZEN_NOT_FOUND');
                                    })
                                    .end(done);
                            });
                    });
            });

            it('should delete artizen by id', done => {
                const username = randomUsername();
                let id;
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': username,
                        'type': ['museum', 'exhibition']
                    })
                    .expect(200)
                    .expect(res => {
                        id = res.body.id;
                    })
                    .end(() => {
                        request(app).delete(`/v1/artizen/${id}`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(() => {
                                request(app).get(`/v1/artizen/${id}`)
                                    .expect(404)
                                    .expect(res => {
                                        assert(res.body.code === 'ARTIZEN_NOT_FOUND');
                                    })
                                    .end(done);
                            });
                    });
            });

            it('should delete relations of artizen', done => {
                const artizenUsername = randomUsername();
                request(app).put(`/v1/artizen/${artizenUsername}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': artizenUsername,
                        'type': ['museum']
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(() => {
                        const artUsername = randomUsername();
                        request(app).put(`/v1/art/${artUsername}`)
                            .send({
                                'title': {'default': 'This is title A', 'en': 'This is title A'},
                                'username': artUsername,
                                'relations': [{'artizen': artizenUsername, 'type': 'exhibition'}]
                            })
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(() => {
                                request(app).delete(`/v1/artizen/${artizenUsername}`)
                                    .expect(200)
                                    .end(() => {
                                        request(app).get(`/v1/art/${artUsername}/artizen`)
                                            .expect(200)
                                            .expect('Content-Type', /json/)
                                            .expect(res => {
                                                assert(res.body.length === 0);
                                            })
                                            .end(done);
                                    });
                            });
                    });
            });

            it('should not return 404', done => {
                request(app).delete(`/v1/artizen/${randomUsername()}`).expect(200, done);
            });

            it('should report invalid username', done => {
                request(app).delete('/v1/artizen/as')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('DELETE art', () => {
            it('should delete data and relations of art', done => {
                const artizenUsername = randomUsername();
                request(app).put(`/v1/artizen/${artizenUsername}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': artizenUsername,
                        'type': ['museum']
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(() => {
                        const artUsername = randomUsername();
                        request(app).put(`/v1/art/${artUsername}`)
                            .send({
                                'title': {'default': 'This is title A', 'en': 'This is title A'},
                                'username': artUsername,
                                'relations': [{'artizen': artizenUsername, 'type': 'exhibition'}]
                            })
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .end(() => {
                                request(app).delete(`/v1/art/${artUsername}`)
                                    .expect(200)
                                    .end(() => {
                                        request(app).get(`/v1/art/${artUsername}`)
                                            .expect(404)
                                            .end(() => {
                                                request(app).get(`/v1/artizen/${artizenUsername}/art`)
                                                    .expect(200)
                                                    .expect(res => {
                                                        assert(res.body.length === 0);
                                                    })
                                                    .end(done);
                                            });
                                    });
                            });
                    });
            });

            it('should not return 404', done => {
                request(app).delete(`/v1/art/${randomUsername()}`).expect(200, done);
            });

            it('should report invalid username', done => {
                request(app).delete('/v1/art/as')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });
    });

    describe('POST api', () => {
        describe('POST introduction to art', () => {
            it('should post introdcution to art', done => {
                request(app).post('/v1/art/10000003/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Ginevra de\' Benci is a portrait painting by Leonardo da Vinci of the 15th-century Florentine aristocrat Ginevra de\' Benci (born c. 1458). The oil-on-wood portrait was acquired by the National Gallery of Art in Washington, D.C. in 1967. The sum of US$5 million—an absolute record price at the time—came from the Ailsa Mellon Bruce Fund and was paid to the Princely House of Liechtenstein. It is the only painting by Leonardo on public view in the Americas.',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should report invalid id', done => {
                request(app).post('/v1/art/artid/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Ginevra de\' Benci is a portrait painting by Leonardo da Vinci of the 15th-century Florentine aristocrat Ginevra de\' Benci (born c. 1458). The oil-on-wood portrait was acquired by the National Gallery of Art in Washington, D.C. in 1967. The sum of US$5 million—an absolute record price at the time—came from the Ailsa Mellon Bruce Fund and was paid to the Princely House of Liechtenstein. It is the only painting by Leonardo on public view in the Americas.',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid introdcution', done => {
                request(app).post('/v1/art/10000003/introduction')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Ginevra de\' Benci is a portrait painting by Leonardo da Vinci of the 15th-century Florentine aristocrat Ginevra de\' Benci (born c. 1458). The oil-on-wood portrait was acquired by the National Gallery of Art in Washington, D.C. in 1967. The sum of US$5 million—an absolute record price at the time—came from the Ailsa Mellon Bruce Fund and was paid to the Princely House of Liechtenstein. It is the only painting by Leonardo on public view in the Americas.',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report no content', done => {
                request(app).post('/v1/art/10000003/introduction')
                    .send({
                        'author_id': '100000010',
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid introduction content', done => {
                request(app).post('/v1/art/10000003/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': 'this is not a json'
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET introduction to art', () => {
            it('should not get invalid introdcution to art', done => {
                let text_id;
                request(app).post('/v1/art/10000003/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Ginevra de\' Benci is a portrait painting by Leonardo da Vinci of the 15th-century Florentine aristocrat Ginevra de\' Benci (born c. 1458). The oil-on-wood portrait was acquired by the National Gallery of Art in Washington, D.C. in 1967. The sum of US$5 million—an absolute record price at the time—came from the Ailsa Mellon Bruce Fund and was paid to the Princely House of Liechtenstein. It is the only painting by Leonardo on public view in the Americas.',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        text_id = parseInt(res.body.id);
                    })
                    .end(() => {
                        request(app).get('/v1/art/10000003/introduction')
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(!res.body.map(item => parseInt(item.id)).includes(text_id));
                            })
                            .end(done);
                    });
            });
            it('should report invalid id', done => {
                request(app).get('/v1/art/artid/introduction')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('POST introduction to artizen', () => {
            it('should post introdcution to artizen', done => {
                request(app).post('/v1/artizen/100000011/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: '大都会艺术博物馆（英语：Metropolitan Museum of Art，昵称The Met）位于美国纽约州纽约市曼哈顿中央公园旁，是世界上最大的、参观人数最多的艺术博物馆之一。[4]主建筑物面积约有8公顷，展出面积有20多公顷。馆藏超过二百万件艺术品[5]，整个博物馆被划分为十七个馆部。[6]主除了主馆外，还有位于曼哈顿上城区修道院博物馆的第二分馆。那里主要展出中世纪的艺术品。',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should report invalid id', done => {
                request(app).post('/v1/artizen/metmuseum/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: '大都会艺术博物馆（英语：Metropolitan Museum of Art，昵称The Met）位于美国纽约州纽约市曼哈顿中央公园旁，是世界上最大的、参观人数最多的艺术博物馆之一。[4]主建筑物面积约有8公顷，展出面积有20多公顷。馆藏超过二百万件艺术品[5]，整个博物馆被划分为十七个馆部。[6]主除了主馆外，还有位于曼哈顿上城区修道院博物馆的第二分馆。那里主要展出中世纪的艺术品。',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid introdcution', done => {
                request(app).post('/v1/artizen/100000011/introduction')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: '大都会艺术博物馆（英语：Metropolitan Museum of Art，昵称The Met）位于美国纽约州纽约市曼哈顿中央公园旁，是世界上最大的、参观人数最多的艺术博物馆之一。[4]主建筑物面积约有8公顷，展出面积有20多公顷。馆藏超过二百万件艺术品[5]，整个博物馆被划分为十七个馆部。[6]主除了主馆外，还有位于曼哈顿上城区修道院博物馆的第二分馆。那里主要展出中世纪的艺术品。',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid introduction content', done => {
                request(app).post('/v1/artizen/100000011/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': 'this is not a json'
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET introduction to artizen', () => {
            it('should not get invalid introdcution to artizen', done => {
                let text_id;
                request(app).post('/v1/artizen/100000011/introduction')
                    .send({
                        'author_id': '100000010',
                        'content': JSON.stringify('大都会艺术博物馆（英语：Metropolitan Museum of Art，昵称The Met）位于美国纽约州纽约市曼哈顿中央公园旁，是世界上最大的、参观人数最多的艺术博物馆之一。[4]主建筑物面积约有8公顷，展出面积有20多公顷。馆藏超过二百万件艺术品[5]，整个博物馆被划分为十七个馆部。[6]主除了主馆外，还有位于曼哈顿上城区修道院博物馆的第二分馆。那里主要展出中世纪的艺术品。')
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        text_id = parseInt(res.body.id);
                    })
                    .end(() => {
                        request(app).get('/v1/artizen/100000011/introduction')
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(!res.body.map(item => parseInt(item.id)).includes(text_id));
                            })
                            .end(done);
                    });
            });
            it('should report invalid id', done => {
                request(app).get('/v1/artizen/artizenid/introduction')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('POST review of art', () => {
            it('should post review of art', done => {
                request(app).post('/v1/art/10000003/review')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Ginevra de\' Benci',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should post rating of art', done => {
                request(app).post('/v1/art/10000003/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should post review of art with rating', done => {
                request(app).post('/v1/art/10000003/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Ginevra de\' Benci',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should report invalid id', done => {
                request(app).post('/v1/art/artid/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Ginevra de\' Benci',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid review content', done => {
                request(app).post('/v1/art/10000003/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': 'this is not a json'
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET review of art', () => {
            it('should get review of art', done => {
                let text_id;
                request(app).post('/v1/art/10000003/review')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Ginevra de\' Benci',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        text_id = parseInt(res.body.id);
                    })
                    .end(() => {
                        request(app).get('/v1/art/10000003/review')
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.map(item => parseInt(item.id)).includes(text_id) && res.body.map(item => parseInt(item.art_id)).includes(10000003));
                            })
                            .end(done);
                    });
            });
            it('should report invalid id', done => {
                request(app).get('/v1/art/artid/review')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('POST review of artizen', () => {
            it('should post review of artizen', done => {
                request(app).post('/v1/artizen/100000011/review')
                    .send({
                        'author_id': '100000010',
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Metropolitan Museum of Art',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should post rating of artizen', done => {
                request(app).post('/v1/artizen/100000011/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should post review of artizen with rating', done => {
                request(app).post('/v1/artizen/100000011/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Metropolitan Museum of Art',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(done);
            });
            it('should report invalid id', done => {
                request(app).post('/v1/artizen/metmuseum/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Metropolitan Museum of Art',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
            it('should report invalid review content', done => {
                request(app).post('/v1/artizen/100000011/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 5,
                        'content': 'this is not a json'
                    })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('GET review of artizen', () => {
            it('should get review of artizen', done => {
                let text_id;
                request(app).post('/v1/artizen/100000011/review')
                    .send({
                        'author_id': '100000010',
                        'rating': 3,
                        'content': {
                            entityMap: {},
                            blocks:
                                [{
                                    key: '9dib2',
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                    type: 'unstyled',
                                    text: 'Review of Metropolitan Museum of Art',
                                    depth: 0
                                }]
                        }
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        text_id = parseInt(res.body.id);
                    })
                    .end(() => {
                        request(app).get('/v1/artizen/100000011/review')
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.map(item => parseInt(item.id)).includes(text_id) && res.body.map(item => parseInt(item.artizen_id)).includes(100000011));
                            })
                            .end(done);
                    });
            });
            it('should report invalid id', done => {
                request(app).get('/v1/artizen/artizenid/review')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });
    });

    describe('Search api', () => {
        describe('Search artizen', () => {
            it('should get artizen data', done => {
                request(app).get('/v1/search?q=marina')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.artizen && res.body.artizen.some(e => e.username === 'marina'));
                    })
                    .end(done);
            });

            it('should support artizen fuzzy query', done => {
                request(app).get('/v1/search?q=marunu')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.artizen && res.body.artizen.some(e => e.username === 'marina'));
                    })
                    .end(done);
            });

            it('should support query with multiple word', done => {
                request(app).get('/v1/search?q=van gogh')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.artizen && res.body.artizen.some(e => e.username === 'vincent-van-gogh'));
                    })
                    .end(done);
            });

            it('should get art data', done => {
                request(app).get('/v1/search?q=met')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000006));
                    })
                    .end(done);
            });

            it('should support artizen name in Chinese', done => {
                request(app).get('/v1/search?q=' + encodeURIComponent('达芬奇'))
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.artizen && res.body.artizen.some(e => e.username === 'leonardo-da-vinci'));
                    })
                    .end(done);
            });

            it('should return empty', done => {
                request(app).get('/v1/search?q=marina&from=999')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.artizen.length === 0 && res.body.art.length === 0);
                    })
                    .end(done);
            });

            it('should report invalid query', done => {
                request(app).get('/v1/search?q=')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid from', done => {
                request(app).get('/v1/search?q=marina&from=a')
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });
        });

        describe('Search art', () => {
            it('should get art data', done => {
                request(app).get('/v1/search?q=musician')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000006));
                    })
                    .end(done);
            });

            it('should support art name in Chinese', done => {
                request(app).get('/v1/search?q=' + encodeURIComponent('奴隶'))
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000004));
                    })
                    .end(done);
            });

            it('should support fuzzy', done => {
                request(app).get('/v1/search?q=vanitus')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000477));
                    })
                    .end(done);
            });

            it('should support operator and', done => {
                request(app).get('/v1/search?q=globe+skull+candle+tazza')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000477));
                    })
                    .end(done);
            });

            it('should support fuzzy with multiple word', done => {
                request(app).get('/v1/search?q=glube+skall+ceedle+tazza')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.art && res.body.art.some(e => e.id === 10000477));
                    })
                    .end(done);
            });
        });

    });
});
