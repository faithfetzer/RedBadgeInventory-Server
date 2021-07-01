const router = require("express").Router();
const { UserModel } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError, json } = require('sequelize');
const validateJWT = require('../middleware/validateSession');
const { route } = require("./locationcontroller");
const User = require("../models/usermodel");

// GET /user/info/:id -user account info by ID- validateJWT

router.get('/:id', validateJWT, async (req, res) => {
    // console.log('param', req.params.id)
    // console.log('user', req.user.id)
    // console.log('admin', req.user.admin)
    if (req.params.id == req.user.id || req.user.admin) {
        const userToGet = await UserModel.findOne({
            where: { id: req.params.id }
        })
        try {
            res.status(200).json({
                message: `User information successfully retrieved`,
                user: userToGet,
            })
        } catch (err) {
            res.status(500).json({
                message: `Error getting user information`
            })
        }
    } else {
        res.status(400).json({
            message: `Not authorized to view user information`
        })
    }
})

// POST /user/login -user login

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(req.body)
    try {
        let loginUser = await UserModel.findOne({
            where: { email: email }
        })
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password)
            if (passwordComparison) {
                const token = jwt.sign(
                    { id: loginUser.id },
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
    let { firstName, lastName, email, password, role } = req.body;
    try {
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcrypt.hashSync(password, 13),
            role: role,
            admin: false
        })
        const token = jwt.sign(
            { id: user.id },
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
    if (req.params.id == req.user.id || req.user.admin) {
        console.log('update')
        let { firstName, lastName, email, role } = req.body;
        const userId = req.params.id;
        console.log(req.body);
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
        try {
            const updateAccount = await UserModel.update(userToUpdate, query)
                res.status(200).json({
                    message: `User account updated`,
                    update: updateAccount
                    })
            } 
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: `User account not updated. Error: ${err}`
            })
        }
    
    } else{
        res.status(401).json({
            message: `Not authorized to update`
        })
    }
    }
)

// PUT /user/update/admin -edit user account to make admin

router.put('/admin', validateJWT, async(req, res) => {
    let { email, admin } = req.body;
    console.log(req.body);
    const userToUpdate = await UserModel.findOne({
        where: { email: email }
    })
    console.log(userToUpdate)
    try {
        if (req.user.admin){
        const updateAdmin = await UserModel.update(
            { admin: admin },
            { where: { email: email } })
            res.status(200).json({
                message: `User admin status updated`,
                update: updateAdmin
                })
        } else {
            res.status(401).json({
                message: `Not authorized to update`
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
    if (req.params.id == req.user.id || req.user.admin) {
            const { email, password } = req.body;
            const userID = req.user.id;
            // console.log('id', req.user.id)
            const userToDelete = await UserModel.findOne({
                where: { id: userID }
            })
            console.log(userToDelete);
            try {
                if (userToDelete) {
                    let passwordComparison = await bcrypt.compare(password, userToDelete.password);
                    if (passwordComparison) {
                        const deletedUser = await UserModel.destroy({
                            where: { id: userID }
                        })
                        res.status(200).json({ msg: "User Account has been deleted" });
                    } else {
                        res.status(401).json({
                            msg: `Incorrect password`
                        })
                    }
                } else {
                    res.status(401).json({
                        msg: `Incorrect email`
                    })
                }
            } catch (err) {
                res.status(500).json({
                    msg: `Error deleting user ${err}`
                }) 
    }
    }else {
        res.status(401).json({
            message: `Not authorized to delete user`
        })
    }
})


module.exports = router