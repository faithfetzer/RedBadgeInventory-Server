const router = require("express").Router();
const {ItemModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');

// GET /items/ - all available items all makers (product feed)

router.get('/')

// GET /items/:maker_id - all items for logged in maker

router.get('/:maker_id')

// POST /items/:maker_id/add - create items for logged in maker

router.get('/:maker_id/add')

// PUT /items/:maker_id/update -edit items for logged in maker

router.get('/:maker_id/update')

// DELETE /items/:maker_id/delete -delete items for logged in maker

router.get('/:maker_id/delete')


module.exports = router