const { Relation } = require('./../db/sequelize')

var create_relations = async(org, parent_name) => {
    const organization = await Relation.findOne({ 
        where: {
            source: org.org_name
        } 
    })

    if (organization)
        throw new Error(`Relations for ${org.org_name} already created.`)
    else
        handle_relations(org, parent_name)
}

var handle_relations = async(org, parent_name) => {
    try {
        if (org.daughters) {
            org.daughters.forEach(daughter => {
                handle_relations(daughter, org.org_name)
            })
        }
        await handle_parent_daughter_relations(org.org_name, parent_name)
        await handle_sisters_relations(org.org_name, parent_name)
    } catch (err) {
        throw err
    }
}

var handle_parent_daughter_relations = async(source, parent) => {
    try {
        var relations = [{
            source: source,
            related: parent,
            relationship_type: "parent"
        }, {
            source: parent,
            related: source,
            relationship_type: "daughter"
        }]
        await Relation.createRelationships(relations)
    } catch (error) {
        throw error
    }
}

var handle_sisters_relations = async(source, parent) => {
    try {
        await Relation.createSisterRelationships(source, parent)
    } catch (error) {
        throw error
    }
}

var get_relations_for_organization = async (org_name, page, page_size) => {
    try {
        const relations = await Relation.getRelations(org_name, page, page_size)
        return relations
    } catch (error) {
        throw error
    }
}

module.exports = { create_relations, get_relations_for_organization }