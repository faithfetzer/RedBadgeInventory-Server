const router = require("express").Router();
const {ItemModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validateSession');

// GET /items/available - all available items all makers (product feed)

router.get('/available')

// GET /items/mine - all items for logged in maker

router.get('/mine')

// POST /items/add - create items for logged in maker

router.get('/add')

// PUT /items/update -edit items for logged in maker

router.get('/update')

// DELETE /items/delete -delete items for logged in maker

router.get('/delete')


module.exports = router