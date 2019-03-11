const { Relation } = require('./../db/sequelize')

var createRelations = async (org, parentName = null) => {
    const organization = await Relation.findOne({
        where: {
            source: org.org_name
        }
    })

    if (organization)
        throw new Error(`Relations for ${org.org_name} already created.`)
    else
        handleRelations(org, parentName)
}

var handleRelations = async (org, parentName) => {
    try {
        if (org.daughters) {
            org.daughters.forEach(daughter => {
                handleRelations(daughter, org.org_name)
            })
        }

        await handleParentDaughterRelations(org.org_name, parentName)
        await handleSistersRelations(org.org_name, parentName)
    } catch (err) {
        throw err
    }
}

var handleParentDaughterRelations = async (source, parent) => {
    try {
        var relationParent = {
            source: source,
            related: parent,
            relationship_type: "parent"
        }
        await Relation.create(relationParent)

        var relationDaughter = {
            source: parent,
            related: source,
            relationship_type: "daughter"
        }
        await Relation.create(relationDaughter)
    } catch (error) {
        throw error
    }
}

var handleSistersRelations = async (source, parent) => {
    try {
        await Relation.createSisterRelationships(source, parent)
    } catch (error) {
        throw error
    }
}

var getRelationsForOrganization = async (org_name, page, page_size) => {
    try {
        const relations = await Relation.getRelations(org_name, page, page_size)
        return relations
    } catch (error) {
        throw error
    }
}

module.exports = { createRelations, getRelationsForOrganization }