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

app.get('/api/relations/:org_name', (req, res) => {
    relationsController.get_relations_for_organization(req.params.org_name, req.query.page, req.query.page_size)
        .then((relations) => {
            res.send(relations)
        })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})