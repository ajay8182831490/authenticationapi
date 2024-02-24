const jwt = require('jsonwebtoken');
const getPool = require('../util/db');
const userSchema = require("../model/user");
const { logError } = require('../util/logger');
const path = require('path');


const userAuth = async (req, res, next) => {

    const token = await req.header('Authorization');


    if (!token) {
        res.status(401).send({ error: "please authentication using a valid token" });
    }
    try {
        const data = jwt.verify(token, 'XUcgh3267');// here we insert process env


        req.user = {
            userId: data.user,
            // Add other user-related information if needed
        };
        let conn = await getPool();

        let userinfo = await userSchema.findById(data.user.id);

        if (userinfo.isVerified) {
            next();
        }
        else {
            res.status(401).json("please verify the account");
        }





    } catch (ex) {
        logError(ex, path.basename(__filename));

        res.status(401).send({ error: "internal server error" });

    }

}





module.exports = userAuth;