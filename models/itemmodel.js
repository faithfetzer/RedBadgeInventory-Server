const {DataTypes} = require('sequelize')
const db = require('../db')

const Item = db.define('item', {
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
    },
    volume:{
        type: DataTypes.INTEGER,
    },
    volumeUnit:{
        type: DataTypes.STRING,
    },
    weight:{
        type: DataTypes.INTEGER,
    },
    weightUnit:{
        type: DataTypes.STRING,
    },
    height:{
        type: DataTypes.INTEGER,
    },
    width:{
        type: DataTypes.INTEGER,
    },
    depth:{
        type: DataTypes.INTEGER,
    },
    lengthUnit:{
        type: DataTypes.STRING,
    },
    category:{
        type: DataTypes.STRING,
    },
    available:{
        type: DataTypes.BOOLEAN,
    },
    price:{
        type: DataTypes.INTEGER,
    },
    totalQuantity: {
        type: DataTypes.INTEGER,
    },
    quantityListed:{
        type: DataTypes.INTEGER,
    },
    quantitySold:{
        type: DataTypes.INTEGER,
    },
})


module.exports = Item;