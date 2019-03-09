const express = require('express')
const bodyParser = require('body-parser')

var relationsController = require('./controllers/relations.controller.js')

var app = express()
var port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/api/relations', (req, res) => {
    relationsController.handle_relations(req.body, null)
    res.send()
})

app.get('/api/relations', (req, res) => {
    relationsController.get_relations_for_organization(req.query.org_name).then((relations) => {
        res.send(relations)
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})