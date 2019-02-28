const Sequelize = require('sequelize')
const RelationModel = require('./../models/relation')

const sequelize = new Sequelize('organizations', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const Relation = RelationModel(sequelize, Sequelize)

Relation.getLevel = (org_name) => {
    return Relation.findOne({
        raw: true,
        where: {
            source: org_name
        }, attributes: ['level']
    }).then(org => {
        return org.level
    })
}

Relation.getRelations = async (org_name) => {
    var results = []
    var parents = []

    // parents
    await Relation.findAll({
        raw: true,
        where: {
            source: org_name
        }, attributes: ['parent']
    }).then(list => {
        var parentsModel = list.map(parent => ({ relationship_type: "parent", org_name: parent.parent }))
        results = results.concat(parentsModel)

        parents = parentsModel.map(parent => parent.org_name)
    })

    // daughters
    await Relation.findAll({
        raw: true,
        where: {
            parent: org_name
        }, attributes: ['source']
    }).then(list => {
        var daughters = list.map(daughter => ({ relationship_type: "daughter", org_name: daughter.source }))
        results = results.concat(daughters)
    })

    // sisters
    await Relation.getLevel(org_name).then(async (level) => {
        await Relation.findAll({
            raw: true,
            where: {
                parent: parents,
                level: level
            }, attributes: [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
        }).then(list => {
            var sisters = list.map(sister => ({ relationship_type: "sister", org_name: sister.source }))
            results = results.concat(sisters)
        })
    })

    return results
}

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports = { Relation, Sequelize }