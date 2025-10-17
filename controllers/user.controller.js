const asyncHandler=require("express-async-handler");
const { checkEmpty } = require("../utils/checkEmpty");
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { isError, error } = checkEmpty({ name, email, password });
        if (isError) {
            return res.status(400).json({ message: "All fields are required", error });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ ...req.body, password: hashedPassword });

        res.status(201).json({ message: "user registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await User.findOne({ email })
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
        const user = jwt.sign({ name: result.name, _id: result._id }, process.env.JWT_KEY)
        res.cookie("user", user, { maxAge: 1000 * 60 * 60 })

        res.json({
            message: "user login success", result: {
                _id: result._id,
                name: result.name,
                email: result.email,
            }
        })
    } catch (error) {
        console.error("Error login user:", error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})
exports.logOutUser = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("user"); // clears cookie
        res.json({ message: "User logged out successfully" }); // no need for req.body
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


exports.userProflie = async (req, res) => {
    console.log(req.user)

    try {
        const result = await User.findOne({ _id: req.user })

        res.json({ message: "get user Profile Success", result });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, } = req.body

        if (!name && !email) {
            return res.status(400).json({ message: 'At least one field (name, email, password) must be provided.' });
        }
        const result = await User.findByIdAndUpdate(id, req.body)

        if (!result) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        return res.status(200).json({ message: 'Profile updated successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
}