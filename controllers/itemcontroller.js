const router = require("express").Router();
const {ItemModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');

// GET /items/ - all available items all makers (product feed)
// GET /items/:maker_id - all items for logged in maker
// POST /items/:maker_id/add - create items for logged in maker
// PUT /items/:maker_id/update -edit items for logged in maker
// DELETE /items/:maker_id/delete -delete items for logged in maker

module.exports = router