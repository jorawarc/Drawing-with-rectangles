
const Path = require('path')
require('dotenv').config({path: Path.resolve(__dirname, '../.env')})

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : process.env.DATABASE_IP,
        port     : process.env.DATABASE_PORT,
        user     : process.env.USER,
        password : process.env.PASSWORD,
        database : 'cs',
        charset  : 'utf8'
    }
})

const jsonColumns = require('bookshelf-json-columns')
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin(jsonColumns)
module.exports = bookshelf;