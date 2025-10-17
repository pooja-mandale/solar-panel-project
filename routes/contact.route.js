const router = require("express").Router()
const contactController = require("../controllers/contact.controller")
// const { adminProtected } = require("../middleware/auth.middleware")

router
   
    .post("/contact", contactController.createContact)



module.exports = router