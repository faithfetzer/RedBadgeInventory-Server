const router = require("express").Router();
const {LocationModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');

// GET /locations/:maker_id -all locations for logged in maker

router.get('/:maker_id')

// POST /locations/:maker_id/add -add location for logged in maker

router.get('/:maker_id/add')

// PUT /locations/:maker_id/update -edit locations for logged in maker

router.get('/:maker_id/update')

// DELETE /locations/:maker_id/delete -delete locations logged in maker

router.get('/:maker_id/delete')



module.exports = router