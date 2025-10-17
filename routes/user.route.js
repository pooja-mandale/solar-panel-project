const router = require("express").Router()
const userController = require("../controllers/user.controller")
const { userProtected } = require("../middleware/auth.middleware")

router
    .post("/register-user", userController.registerUser)
    .post("/login-user", userController.loginUser)
    .post("/logout-user", userController.logOutUser)
    .get("/fetchProfile",userProtected, userController.userProflie)
    .put("/update-profile/:id",userProtected, userController.updateUserProfile)



module.exports = router