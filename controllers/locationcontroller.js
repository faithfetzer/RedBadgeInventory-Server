const router = require("express").Router();
const {LocationModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validateSession');

// GET /locations/ -all locations for logged in maker

router.get('/')

// POST /locations/add -add location for logged in maker

router.get('/add')

// PUT /locations/update -edit locations for logged in maker

router.get('/update')

// DELETE /locations/delete -delete locations logged in maker

router.get('/delete')



module.exports = router