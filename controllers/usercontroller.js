const router = require("express").Router();
const {UserModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');

// GET /user/:id -user account info by ID
// POST /user/login -user login
// POST /user/register - user create
// PUT /user/update -edit user account
// DELETE /user/:ID/delete -delete user account by user id


module.exports = router