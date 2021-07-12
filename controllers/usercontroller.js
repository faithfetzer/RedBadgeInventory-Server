const router = require("express").Router();
const { models } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const validateJWT = require('../middleware/validatesession');
const validateAdmin = require('../middleware/validateadmin')

// get /user/idadmin - get user id by email for admin // post???

router.post('/idadmin', validateJWT, validateAdmin, async(req, res) =>{
    const {email} = req.body
    const userID = await models.UserModel.findOne({
        where: {
            email: email
        }
    })
    console.log(req.body)
    try {if(userID){
            res.status(200).json({
            message: `User info successfully retrieved`,
            user: userID,
        })} else{res.status(401).json({
            message: `Incorrect email`
        })}
    } catch (err) {
        res.status(500).json({
            message: `Error getting user information. Error ${err}`
        })
    }
})

// GET /user/info/:id -user account info by ID- validateJWT

router.get('/:id', validateJWT, async (req, res) => {
    // console.log('param', req.params.id)
    // console.log('user', req.user.id)
    // console.log('admin', req.user.admin)
    try {
        if (req.params.id == req.user.id || req.user.admin) {
            const userToGet = await models.UserModel.findOne({
                where: { id: req.params.id }
                })
            res.status(200).json({
                message: `User information successfully retrieved`,
                user: userToGet,
            })
        } else {
            res.status(400).json({
                message: `Not authorized to view user information`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error getting user information. Error ${err}`
        })
    }
})

// POST /user/login -user login

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    // console.log(req.body)
    try {
        const loginUser = await models.UserModel.findOne({
            where: { email: email }
        })
        if (loginUser) {
            // console.log('user info', loginUser.id, loginUser.admin)
            const passwordComparison = await bcrypt.compare(password, loginUser.password)
            if (passwordComparison) {
                const token = jwt.sign(
                    { id: loginUser.id, admin: loginUser.admin },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 12 }
                )
                res.status(200).json({
                    message: `User logged in`,
                    user: loginUser,
                    token: token
                })
            } else {
                res.status(401).json({
                    message: `Incorrect email or password`
                })
            }
        } else {
            res.status(401).json({
                message: `Incorrect email or password`
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `Failed to log in. Error: ${err}`
        })
    }
})

// POST /user/register - user create

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const user = await models.UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 13),
            role: role,
            admin: false
        })
        const token = jwt.sign(
            { id: user.id, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 * 12 }
        )

        res.status(201).json({
            message: `User account created`,
            user: user,
            token: token
        })
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: `Failed to register user. Email already in use`
            })
        } else {
            res.status(500).json({
                message: `Failed to register user. Error: ${err}`
            })
        }
    }
})

// PUT /user/update/:id -edit user account- validateJWT

router.put('/update/:id', validateJWT, async (req, res) => {
    try {
        if (req.params.id == req.user.id || req.user.admin) {
            const { firstName, lastName, email, role } = req.body;
            const userId = req.params.id;
            // console.log(req.body);
            const query = {
                where: {
                    id: userId
                }
            }
            const userToUpdate = {
                firstName: firstName, 
                lastName: lastName, 
                email: email, 
                role: role
            };
            const updateAccount = await models.UserModel.update(userToUpdate, query)
                res.status(200).json({
                    message: `User account updated`,
                    updated: updateAccount
                    })
        } else{
            res.status(401).json({
                message: `Not authorized to update`
            })
        }
    } catch (err) {
            console.log(err)
            res.status(500).json({
                message: `User account not updated. Error: ${err}`
            })
        }
})

// PUT /user/admin -edit user account to make admin

router.put('/admin', validateJWT, async(req, res) => {
    const { email, admin } = req.body;
    console.log(req.body);
    const userToUpdate = await models.UserModel.findOne({
        where: { email: email }
    })
    console.log(userToUpdate)
    try {
        if(userToUpdate.role === 'maker'){
        const updateAdmin = await models.UserModel.update(
            { admin: admin },
            { where: { email: email } })
            res.status(200).json({
                message: `User admin status updated`,
                update: updateAdmin
                })
            }else{
                res.status(401).json({
                    message: `User must be a maker to have admin status`
                })
            }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `User admin status not updated. Error: ${err}`
        })
    }

})

// DELETE /user/delete/:id -delete user account by user id- validateJWT

router.delete('/delete/:id', validateJWT, async (req, res) => {
    try {
        if (req.params.id == req.user.id || req.user.admin) {
            const { email } = req.body;
            const userToDelete = await models.UserModel.findOne({
                where: { email: email, id: req.params.id }
                })
            console.log(userToDelete);
            if (userToDelete) {
                const deletedUser = await models.UserModel.destroy({
                        where: { email: email }
                        })
                        res.status(200).json({ message: "User Account has been deleted" });
            } else {
                res.status(401).json({
                    message: `Incorrect email`
                    })
            }
        }else {
            res.status(401).json({
                message: `Not authorized to delete user`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error deleting user ${err}`
            }) 
    }
})


module.exports = router