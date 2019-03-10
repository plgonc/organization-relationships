const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config/config.js')
var relationsController = require('./controllers/relations.controller.js')

var app = express()
var port = global.gConfig.port || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/api/relations', (req, res) => {
    relationsController
        .createRelations(req.body, null)
        .then((result) => {
            res.send()
        })
        .catch((err) => {
            res.status(500).json({
                type: 'error', 
                message: `something went wrong. ${err.message}`
              })
        })
})

app.get('/api/relations/:org_name', (req, res) => {
    relationsController
        .getRelationsForOrganization(req.params.org_name, req.query.page, req.query.page_size)
        .then((relations) => {
            res.send(relations)
        })
})

app.get('/ping', (req, res) => {
    res.send()
})

var server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = server