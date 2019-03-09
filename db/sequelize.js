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

Relation.createRelationships = async(relationships) => {
    Relation.bulkCreate(relationships)
}

Relation.createSisterRelationships = async(org_name, parent) => {
    const sisters = await Relation.findAll({
        raw: true,
        where: {
            source: { $not: org_name},
            related: parent,
            relationship_type: "parent"
        }
    })

    sisters.forEach(relationship => {
        Relation.findOrCreate({
            where: {
                source: org_name,
                related: relationship.source,
                relationship_type: "sister"
            },
            defaults: {
                source: org_name,
                related: relationship.source,
                relationship_type: "sister"
            }
        })
    })
}

Relation.getRelations = async(org_name, page, page_size) => {
    if (page === undefined) 
        page = 1
    
    if (page_size > 100 || page_size === undefined)
        page_size = 100
        
	var offset = page_size * (page - 1);

    const relations = await Relation.findAll({
        raw: true,
        where: {
            source: org_name
        },
        attributes: [
            ['related', 'org_name'], 
            'relationship_type'
        ],
        limit: parseInt(page_size),
        offset: offset,
        order: [
            ['related', 'ASC']
        ]
    })

    return relations
}

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`)
    })

module.exports = { Relation, Sequelize }