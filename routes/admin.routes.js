const router = require("express").Router()
const AdminController = require("../controllers/admin.controller")
const { adminProtected } = require("../middleware/auth.middleware")
// const { adminProtected } = require("../middleware/auth.middleware")

router
    .post("/register-admin", AdminController.registerAdmin)
    .post("/login-admin", AdminController.loginAdmin)
    .post("/logout-admin", AdminController.logOutAdmin)
    .get("/getAllUsers",adminProtected, AdminController.getAllUsers)
    .get("/getAllcontactForm",adminProtected, AdminController.getAllContactForm)
    .get("/fetchAdminProfile",adminProtected, AdminController.adminProflie)



module.exports = router