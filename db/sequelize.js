const Sequelize = require('sequelize')
const RelationModel = require('./../models/relation')

const sequelize = new Sequelize(global.gConfig.database, global.gConfig.db_user, global.gConfig.db_password, {
    host: global.gConfig.db_host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
})

const Relation = RelationModel(sequelize, Sequelize)

Relation.createSisterRelationships = async (orgName, parent) => {
    const sisters = await Relation.findAll({
        raw: true,
        where: {
            source: { $not: orgName},
            related: parent,
            relationship_type: "parent"
        }
    })

    sisters.forEach(relationship => {
        Relation.findOrCreate({
            where: {
                source: orgName,
                related: relationship.source,
                relationship_type: "sister"
            },
            defaults: {
                source: orgName,
                related: relationship.source,
                relationship_type: "sister"
            }
        })
    })
}

Relation.getRelations = async (orgName, page = 1, pageSize = 100) => {
	var offset = pageSize * (page - 1)

    const relations = await Relation.findAll({
        raw: true,
        where: {
            source: orgName,
            related: {
                $ne: null
            }
        },
        attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('related')), 'org_name'], 
            'relationship_type'
        ],
        limit: parseInt(pageSize),
        offset: offset,
        order: [
            ['related', 'ASC']
        ]
    })

    return relations
}

sequelize.sync({ force: false })
    .then(() => {})

module.exports = { Relation }