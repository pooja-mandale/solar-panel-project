const asyncHandler=require("express-async-handler");
const { checkEmpty } = require("../utils/checkEmpty");
const Admin = require("../models/Admin");
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const User = require("../models/User");
const Contact = require("../models/Contact");

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { isError, error } = checkEmpty({ name, email, password });
        if (isError) {
            return res.status(400).json({ message: "All fields are required", error });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({ ...req.body, password: hashedPassword });

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error registering admin:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await Admin.findOne({ email })
        const { isError, error } = checkEmpty({ email, password })
        if (isError) {
            return res.status(401).json({ message: "All Feild Require", error })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" })
        }
        if (!result) {
            return res.status(401).json({ message: "email not found" })
        }
        const isVerify = await bcrypt.compare(password, result.password)
        if (!isVerify) {
            res.status(401).json({ message: "password do not match" })
        }
        const admin = jwt.sign({ name: result.name, _id: result._id }, process.env.JWT_KEY)
        res.cookie("admin", admin, { maxAge: 1000 * 60 * 60 })

        res.json({
            message: "Admin login success", result: {
                _id: result._id,
                name: result.name,
                email: result.email,
            }
        })
    } catch (error) {
        console.error("Error login admin:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.logOutAdmin = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("admin")
        res.json({ message: "admin logged out successfully" })
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const result = await User.find(req.body)
        res.json({ message: "user Fetch Success", result })

    } catch (error) {
        console.error("Error getAllUser admin:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.getAllContactForm = asyncHandler(async (req, res) => {
    try {
        const result = await Contact.find(req.body)
        res.json({ message: "ContactForm Fetch Success", result })

    } catch (error) {
        console.error("Error ContactForm admin:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.adminProflie = async (req, res) => {
    console.log(req.user)

    try {
        const result = await Admin.findOne({ _id: req.user })

        res.json({ message: "get Admin Profile Success", result });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
