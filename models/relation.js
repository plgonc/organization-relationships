module.exports = (sequelize, type) => {
    return sequelize.define('relation', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        source: type.STRING,
        related: type.STRING,
        relationship_type: type.STRING
    })
}