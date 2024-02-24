
const { logError } = require('../../../util/logger');

require('dotenv').config();
const path = require('path');
const userSchema = require('../../../model/user');
const getPool = require("../../../util/db");
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const { encryptPassword, getPasswordInfo, verifyPassword } = require("../../../util/password");
const { getToken } = require('../../../util/util');
const secretKey = 'XUcgh3267'

const { sendEmail, generateOTP, sendEmailforOtp } = require('../../../util/util');





class User {


    static async addUser(name, email, password, image) {
        let conn = await getPool();
        // console.log(conn);



        try {

            let hashPassword = await encryptPassword(password, 15);

            let otp = generateOTP();
            let otpemail = await sendEmailforOtp(email, otp);


            const database = (await userSchema.create({ name: name, email: email, password: hashPassword, image: image, otp: otp }));;

            return database;
        }
        catch (error) {

            logError(error, path.basename(__filename));

        }

    }
    static async verifyOtp(otp, email) {
        try {
            let conn = await getPool();
            let user = await userSchema.findOne({ email }, { "otp": 1, _id: 0 });

            if (user.otp == otp) {
                await userSchema.findOneAndUpdate({ email }, {
                    $set: {
                        isVerified: true,
                        otp: ""
                    }
                })


                return true;
            }
            else {
                return false;
            }

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }
    }
    static async existFind(data) {
        try {
            let conn = await getPool();


            let result = await userSchema.findOne(data)

            return result;


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);

        }

    }
    static async userLogin(email) {
        try {
            let conn = await getPool();
            let result = await userSchema.findOne({ email: email });




            const data = {
                user: {
                    id: result._id
                }
            }





            let token = await jwt.sign(data, secretKey);

            return { token, result };;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
    static async userUpdate(id, data, image) {
        try {



            let result;
            if (image && data.name == '') {


                result = await userSchema.findByIdAndUpdate(id, { $set: { image: image } }, { new: true });

            }
            else if (!image && data) {


                result = await userSchema.findByIdAndUpdate(id, { $set: data }, { new: true });

            }
            else {

                result = await userSchema.findByIdAndUpdate(id, { $set: { data, image: image } }, { new: true });

            }





            return result;

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }




    static async findById(id) {
        try {
            let conn = await getPool();
            return await userSchema.findById(id);

        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }


    static async userResetPassword(email) {

        try {
            let conn = await getPool();

            let token = getToken();
            console.log(token);

            let result = await userSchema.findOneAndUpdate({ email: email }, { $set: { tokens: token } }, { new: true }).select("-password");


            let resetEmail = await sendEmail(email, token)


            return true;



        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;
        }

    }
    static async resetPassword(tokens, password) {
        try {


            let conn = await getPool();
            console.log(tokens);


            let hashPassword = await encryptPassword(password, 15);

            let result = await userSchema.findOneAndUpdate({ tokens: tokens }, { $set: { password: hashPassword, tokens: "" } }, { new: true }).select("-password");

            return result;






        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }
    }

    static async resendOTP(email) {
        try {
            let conn = await getPool();


            let result = await userSchema.findOne({ email: email })
            console.log(result);
            if (result) {
                let otp = generateOTP();
                let otpemail = await sendEmailforOtp(email, otp);
                let otpresult = await userSchema.findByIdAndUpdate(result._id, { $set: { otp: otp } }, { new: true });
                return true;
            }
            else {
                return false;
            }




        }
        catch (ex) {
            logError(ex, path.basename(__filename));
            throw new Error(ex.message);


        }

    }
    static async deleteAcoount(id) {
        try {
            let conn = await getPool();
            let result = await userSchema.findById(id);




            let result1 = await userSchema.findByIdAndDelete(result._id);
            return result1;


        } catch (ex) {
            logError(ex, path.basename(__filename));
            throw ex;

        }

    }
}

module.exports = User;