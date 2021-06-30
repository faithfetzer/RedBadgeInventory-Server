const router = require("express").Router();
const {UserModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validateSession');
const { route } = require("./locationcontroller");

// GET /user/info/:id -user account info by ID- validateJWT

router.get('/:id', validateJWT, async(req, res) =>{
    if(req.params.id === req.user.id || req.user.admin){
    const userToGet = await UserModel.findOne({
        where: {id: req.params.id}
    })
    try{
        res.status(200).json({
            message: `User information successfully retrieved`,
            user: userToGet,
        })
    } catch(err){
        res.status(500).json({
            message: `Error getting user information`
        })
    }
    } else{
        res.status(400).json({
            message: `Not authorized to view user information`
        })
    }
})

// POST /user/login -user login

router.post('/login', async(req, res) =>{
    let {firstName, lastName} = req.body;
    try{
        
    } catch (err){

    }
})

// POST /user/register - user create

router.post('/register', async(req, res) => {
    let {firstName, lastName, email, password, role} = req.body;
    try{

    } catch (err){

    }
})

// PUT /user/update/:id -edit user account- validateJWT

router.put('/:id', validateJWT, async(req, res) =>{
    if(req.params.id === req.user.id || req.user.admin){

    }
})

// DELETE /user/delete/:id -delete user account by user id- validateJWT

router.get('/:id', validateJWT, async(req, res) =>{
    if(req.params.id === req.user.id || req.user.admin){

    }
})


module.exports = router