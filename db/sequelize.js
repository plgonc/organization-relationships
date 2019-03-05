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

    // parents
    const parents = await getParents(org_name)
    results = results.concat(parents)

    // daughters
    const daughters = await getDaughters(org_name)
    results = results.concat(daughters)

    // sisters
    var parentsSearch = parents.map(parent => parent.org_name)
    const sisters = await getSisters(org_name, parentsSearch)
    results = results.concat(sisters)

    return results
}

var getParents = async(org_name) => {
    const parentsModel = await Relation.findAll({
        raw: true,
        where: {
            source: org_name
        }, attributes: [
            'parent'
        ]
    })

    const parents = parentsModel.map(parent => ({
        relationship_type: "parent", 
        org_name: parent.parent }
    ))

    return parents
}

var getDaughters = async(org_name) => {
    const daughtersModel = await Relation.findAll({
        raw: true,
        where: {
            parent: org_name
        }, attributes: [
            'source'
        ]
    })

    const daughters = daughtersModel.map(daughter => ({ 
        relationship_type: "daughter", 
        org_name: daughter.source }
    ))

    return daughters
}

var getSisters = async (org_name, parents) => {
    const level = await Relation.getLevel(org_name)
    const list = await Relation.findAll({
        raw: true,
        where: {
            parent: parents,
            level: level
        }, 
        attributes: [
            Sequelize.fn('DISTINCT', Sequelize.col('source')),
            'source'
        ]
    })

    const sisters = list.map(sister => ({ 
        relationship_type: "sister", 
        org_name: sister.source }
    ))

    return sisters
}

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports = { Relation, Sequelize }