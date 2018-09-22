const request = require('supertest');
const app = require('../app');
const uuidv4 = require('uuid/v4');
const assert = require('assert');

/* eslint-disable no-console */

function randomUsername() {
    return uuidv4().replace(/^[-\d]+/, '').replace(/-+$/, '');
}

describe('Index page', () => {
    it('should render successfully', done => {
        request(app).get('/').expect(200, done);
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

            it('should report ART_NOT_FOUND', done => {
                request(app).get('/v1/art/00000000/artizen')
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ART_NOT_FOUND');
                    })
                    .end(done);
            });

            it('should report ART_NOT_FOUND', done => {
                request(app).get('/v1/art/notexist/artizen')
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.code === 'ART_NOT_FOUND');
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
            it('should get artizen data', done => {
                request(app).get('/v1/artizen/1000000011')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === 'metmuseum');
                    })
                    .end(done);
            });

            it('should get artizen data', done => {
                request(app).get('/v1/artizen/metmuseum')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(parseInt(res.body.id) === 1000000011);
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
                request(app).get('/v1/artizen/0000000000').expect(404)
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
                request(app).get('/v1/artizen/metmuseum/art?type=artist').expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.length === 0);
                    })
                    .end(done);
            });

            // it('should return empty relations', done => {
            //     request(app).get('/v1/art/10000003/artizen?type=notexist').expect(200)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.length === 0);)
            //         .end(done);
            // });
            //
            // it('should report invalid id', done => {
            //     request(app).get('/v1/art/1000003/artizen').expect(400)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.errors)
            //         .end(done);
            // });
            //
            // it('should report invalid username', done => {
            //     request(app).get('/v1/art/as/artizen').expect(400)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.errors)
            //         .end(done);
            // });
            //
            // it('should report ART_NOT_FOUND', done => {
            //     request(app).get('/v1/art/00000000/artizen').expect(404)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.code === 'ART_NOT_FOUND')
            //         .end(done);
            // });
            //
            // it('should report ART_NOT_FOUND', done => {
            //     request(app).get('/v1/art/notexist/artizen').expect(404)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.code === 'ART_NOT_FOUND')
            //         .end(done);
            // });
            // it('should report invalid type', done => {
            //     request(app).get('/v1/art/10000003/artizen?type=123').expect(400)
            //         .expect('Content-Type', /json/)
            //         .expect(res => {assert(res.body.errors)
            //         .end(done);
            // });
        });
    });

    describe('PUT api', () => {
        describe('PUT artizen', () => {
            it('should put artizen data', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'default': 'This is name A', 'en': 'This is name A'},
                        'username': username,
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{10}$/));
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

            it('should put artizen data', done => {
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
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{10}$/));
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

            it('should report invalid data', done => {
                const username = randomUsername();
                request(app).put(`/v1/artizen/${username}`)
                    .send({
                        'name': {'en': 'This is name A'},
                        'username': randomUsername()
                    })
                    .expect(400)
                    .expect(res => {
                        assert(res.body.errors);
                    })
                    .end(done);
            });

            it('should report invalid data', done => {
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
                        'relations': [
                            {'artizen': 'nga', 'type': 'museum'},
                            {'artizen': 'nga', 'type': 'exhibition'},
                            {'artizen': 'caravaggio', 'type': 'artist'},
                            {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(res => {
                        assert(res.body.username === username && res.body.id.toString().match(/^\d{10}$/));
                    })
                    .end(() => {
                        request(app).get(`/v1/art/${username}/artizen`)
                            .expect(200)
                            .expect('Content-Type', /json/)
                            .expect(res => {
                                assert(res.body.length === 3);
                                for (let item of res.body) {
                                    assert((item.type === 'artist' && item.data.length === 2) || (item.type === 'museum' && item.data.length === 1) || (item.type === 'exhibition' && item.data.length === 1 && parseInt(item.data[0].id) === 1000000012));
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
                                    .end(done);
                            });
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
        });
    });
});
