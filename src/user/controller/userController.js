const path = require('path');
const { logError, logInfo } = require('../../../util/logger');
const userService = require("../service/userService");


const addUser = async (req, res, next) => {
    logInfo("going to add new user in database", path.basename(__filename), addUser.name);


    const { name, email, password } = req.body;




    try {



        let result = await userService.addUser(name, email, password, req.file.filename);
        if (result == false) {
            res.status(401).json({ msg: "user already exist", success: false });
        }

        else {


            res.status(201).json({ msg: "Account created successfully", success: true });

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json("Internal Server error");

    }



}
const verifyOtp = async (req, res, next) => {
    logInfo("going to verify account", path.basename(__filename), verifyOtp.name);
    try {
        const { otp, email } = req.body;;



        let result = await userService.verifyOtp(otp, email);
        if (!result) {
            res.status(401).json({ msg: 'invalid otp', success: false });
        }
        else {
            res.status(200).json({ msg: "account verified", success: true });
        }

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}
const userLogin = async (req, res, next) => {
    logInfo("going to login the user by using email", path.basename(__filename), userLogin.name);

    const { email, password } = req.body;
    //  const data = req.body;


    try {
        let result = await userService.userLogin(email, password);




        if (result == false) {
            res.status(401).json({ msg: "please enter the correct credentail", success: false, exist: true });
        }
        else if (result == "no") {
            res.status(401).json({ msg: "user not found ", success: false, exist: false });
        }
        else {
            res.status(201).json({ token: result.token, isVerified: result.result.isVerified, success: true, exist: true });

        }

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json("Internal Server error");
    }
}
const resendOTP = async (req, res, next) => {
    logInfo("going to resened otp for verify account", path.basename, resendOTP.name);
    try {
        const { email } = req.body;
        let result = await userService.resendOTP(email);
        if (!result) {
            res.status(400).json({ msg: "please enter valid email", success: false })
        }
        else {

            res.status(200).json({ msg: "otp sent successfully on your email", success: true })
        }
    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json({ msg: "internal server error", success: false });

    }
}

const userUpdate = async (req, res, next) => {
    logInfo("going to update  the user information", path.basename(__filename), userUpdate.name);
    const { id } = req.user.userId;




    try {


        if (req.file) {
            let result = await userService.userUpdate(id, req.body, req.file.filename);

            res.status(200).json({ msg: "profile updated successfully", success: true });

        }
        else {
            let result = await userService.userUpdate(id, req.body);

            res.status(200).json({ msg: "profile updated successfully", success: true });

        }


    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json({ msg: "Internal Server error", success: false });
    }



}
const userUpdatePassword = async (req, res, next) => {

    logInfo("going to update password", path.basename(__filename), userUpdatePassword.name);
    const data = req.body;
    const { id } = req.user.userId;;






    try {

        let result = await userService.userUpdatePassword(id, data)




        if (!result) {
            res.status(401).json({ msg: "please enter correct password", success: false });
        }
        else {

            res.status(200).json({ msg: "password updated successfully", success: true });
        }

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json("Internal Server error");
    }
}
const userResetPassword = async (req, res, next) => {

    logInfo("going to send reset password link", path.basename(__filename), userResetPassword.name);
    try {

        const { email } = req.body;
        let result = await userService.userResetPassword(email);

        if (!result) {
            res.status(401).json({ msg: "Enter a correct email", success: false });
        }
        else {
            res.status(200).json({ msg: "For reset passwod link has been sent on your email", success: true });
        }

    }
    catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json("Internal Server error");
    }

}

const resetPassword = async (req, res, next) => {
    logInfo("Going to reset password ", path.basename(__filename), resetPassword.name);
    try {

        const { token } = req.query;
        const { password } = req.body

        let result = await userService.resetPassword(token, password);


        if (!result) {
            res.status(401).json("please check your email or try to reset password again");
        }
        else {
            res.status(201).json({ msg: "password is successfully updated..." });
        }

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(501).json("internal server error");

    }



}
const findUserProfile = async (req, res, next) => {


    logInfo("going to fetch all user information", path.basename(__filename), findUserProfile.name);
    const { id } = req.user.userId;
    try {
        let result = await userService.findUserProfile(id);



        if (!result) {
            res.status(401).json("something error occured,please try again");
        }
        else {

            res.status(200).json(result);
        }

    } catch (ex) {
        logInfo(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }

}

const deleteAcoount = async (req, res, next) => {
    logInfo("going to delete account ", path.basename(__filename), deleteAcoount.name);
    try {
        const { id } = req.user.userId;
        const { password } = req.body;
        let result = await userService.deleteAcoount(id, password);
        if (!result) {
            res.status(400).json({ msg: "enter correct passwod", success: false })
        }
        else {
            res.status(200).json({ msg: "account deleted successfully", success: true });
        }

    } catch (ex) {
        logError(ex, path.basename(__filename));
        res.status(500).json("internal server error");

    }
}




module.exports = { addUser, userLogin, userUpdate, userUpdatePassword, userResetPassword, resetPassword, findUserProfile, verifyOtp, resendOTP, deleteAcoount };