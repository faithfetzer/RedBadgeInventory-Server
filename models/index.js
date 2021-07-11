const db = require('../db')

const ItemModel = require('./itemmodel');
const LocationModel = require('./locationmodel')
const UserModel = require('./usermodel');

UserModel.hasMany(LocationModel);
UserModel.hasMany(ItemModel);

LocationModel.hasOne(ItemModel);

ItemModel.belongsTo(LocationModel);
ItemModel.belongsTo(UserModel);
LocationModel.belongsTo(UserModel);

module.exports = {
    dbConnection: db,
    models: {ItemModel, LocationModel, UserModel}
}