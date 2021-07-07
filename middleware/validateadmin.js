require("dotenv").config;
const jwt = require("jsonwebtoken");
const { UserModel } = require('../models');

const validateAdmin = async (req, res, next) => {
    // console.log(req.headers)
    // console.log(req.body);
    if (req.method == "OPTIONS") {
        next();
    } else if (req.headers.authorization) {
        const { authorization } = req.headers;
        // console.log("authorization -->", authorization);

        const payload = authorization ? jwt.verify( authorization, process.env.JWT_SECRET): undefined;
            // console.log("payload -->", payload);

            if (payload) {
                let foundUser = await UserModel.findOne({where: { id: payload.id, admin: payload.admin }});
                // console.log("foundUser -->", foundUser);
    
                if (foundUser.admin) {
                    console.log("request -->", req);
                    req.user = foundUser;
                    // console.log('found', foundUser)
                    next();
                } else {
                    res.status(400).send({ message: "Not Authorized" });
                }
            } else {
                res.status(401).send({ message: "Invalid token" });
        }
    } else {
        res.status(403).send({ message: "Forbidden" });
    }
};

module.exports = validateAdmin

// add admin true/false state into token in login/register
// validate admin in admin accounts
// can get rid of user/idadmin? change to if/else
// change this code to check admin status