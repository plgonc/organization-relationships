const { Relation } = require('./../db/sequelize')

var handle_relations = (org, parent_name, level) => { 
    if (org.daughters) {
        org.daughters.forEach(daughter => {
            handle_relations(daughter, org.org_name, level + 1)
        })
    }
    Relation.create({
        source: org.org_name,
        parent: parent_name,
        level: level
    })
}

var get_relations_for_organization = async (org_name) => {
    var relations = await Relation.getRelations(org_name)

    relations.sort(sortByProperty('org_name'))

    return relations
}

var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};

module.exports = { handle_relations, get_relations_for_organization }