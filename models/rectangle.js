const bookshelf = require('./databaseService');

const rectangle = bookshelf.model('rectangle', {
    tableName: 'rectangle',
    idAttribute: 'identifier',
    getAllRectangles() {
        return this.fetchAll()
    },
    getRectangleByID(identifier) {
        return this.where('identifier', identifier).fetch().then(function(res) {
            return res.toJSON()
        })
    }
})

module.exports = rectangle;