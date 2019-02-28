module.exports = (sequelize, type) => {
    return sequelize.define('relation', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        source: type.STRING,
        parent: type.STRING,
        level: type.INTEGER
    }, {
        indexes: [{
            name: 'parent_level',
            fields: ['parent', 'level']
        }]    
    })
}