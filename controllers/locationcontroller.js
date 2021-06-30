const router = require("express").Router();
const {LocationModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');

// GET /locations/:maker_id -all locations for logged in maker
// POST /locations/:maker_id/add -add location for logged in maker
// PUT /locations/:maker_id/update -edit locations for logged in maker
// DELETE /locations/:maker_id/delete -delete locations logged in maker

module.exports = router