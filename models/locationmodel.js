const {DataTypes} = require('sequelize')
const db = require('../db')

const Location = db.define('location', {
    maker_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url:{
        type: DataTypes.STRING,
    },
    address:{
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.STRING,
    }
})


module.exports = Location;