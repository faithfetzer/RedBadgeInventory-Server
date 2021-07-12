require('dotenv').config()
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DATABASE_DIALECT
// })
const sequelize = new Sequelize(process.env.DATABASE_URL_LOCAL)

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     ssl: process.env.ENVIRONMENT ==='production'
// })

module.exports = sequelize;