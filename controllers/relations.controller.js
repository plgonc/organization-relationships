const { Relation } = require('./../db/sequelize')

var handle_relations = async(org, parent_name) => { 
    if (org.daughters) {
        org.daughters.forEach(daughter => {
            handle_relations(daughter, org.org_name)
        })
    }
    await handle_parent_daughter_relations(org.org_name, parent_name)
    await handle_sisters_relations(org.org_name, parent_name)
}

var handle_parent_daughter_relations = async(source, parent) => {
    console.log(`go handle relations: ${source} - ${parent}`)
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
}

var handle_sisters_relations = async(source, parent) => {
    await Relation.createSisterRelationships(source, parent)
}

var get_relations_for_organization = async (org_name, page, page_size) => {
    const relations = await Relation.getRelations(org_name, page, page_size)

    return relations
}

module.exports = { handle_relations, get_relations_for_organization }