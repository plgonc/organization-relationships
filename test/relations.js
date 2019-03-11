process.env.NODE_ENV = 'test'

var server = require('../server')
var fs = require('fs')
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()

const Relation = require('../db/sequelize.js').Relation

chai.use(chaiHttp);

describe('/GET', () => {
    before((done) => {
        Relation.truncate({ cascade: true, restartIdentity: true })
        chai.request(server)
            .post('/api/relations/')
            .send(JSON.parse(fs.readFileSync('./test/post.json', 'utf8')))
            .end((err, res) => { })
        setTimeout(() => {
            done()
        }, 1000)
    });

    it('it should get all the relations for Black Banana', (done) => {
        chai.request(server)
            .get('/api/relations/' + 'Black Banana')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(6)
                done()
            })
    })

    it('it should get second page of relations for Black Banana', (done) => {
        chai.request(server)
            .get('/api/relations/' + 'Black Banana')
            .query({ page: 2, page_size: 3 })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(3)
                done()
            })
    })

    it('it should get empty array response for page 3 with size 3 for Black Banana', (done) => {
        chai.request(server)
            .get('/api/relations/' + 'Black Banana')
            .query({ page: 3, page_size: 3 })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(0)
                done()
            })
    })

    it('it should get only 2 daughter for Paradise Island', (done) => {
        chai.request(server)
            .get('/api/relations/' + 'Paradise Island')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(2)
                res.body.forEach((element) => {
                    element.relationship_type.should.be.eql("daughter")
                })
                done()
            })
    })
})

describe('/POST', () => {
    beforeEach((done) => {
        Relation.truncate({ cascade: true, restartIdentity: true })
        done()
    });

    it('it should create relations between organization', (done) => {
        chai.request(server)
            .post('/api/relations/')
            .send(JSON.parse(fs.readFileSync('./test/post.json', 'utf8')))
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })

    it('it should reply with 500 status code when trying to create existing organization relations', (done) => {
        chai.request(server)
            .post('/api/relations/')
            .send(JSON.parse(fs.readFileSync('./test/post.json', 'utf8')))
            .end((err, res) => {
                res.should.have.status(200)
            })
        setTimeout(() => {
            chai.request(server)
                .post('/api/relations/')
                .send(JSON.parse(fs.readFileSync('./test/post.json', 'utf8')))
                .end((err, res) => {
                    res.should.have.status(500)
                    res.body.should.be.a('object')
                    res.body.type.should.be.eql('error')
                    res.body.message.should.be.eql('something went wrong. Relations for Paradise Island already created.')
                })
        }, 1000)
        done()
    })
})