const jwt = require("jsonwebtoken")

exports.adminProtected = (req, res, next) => {
    const admin = req.cookies.admin
    console.log(req.cookies)

    if (!admin) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    jwt.verify(admin, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error)
            return res.status(401).json({ message: "JWT error", error: error.message })
        }
        req.user = decode._id
    })
    next()
}
exports.userProtected = (req, res, next) => {
    const { user } = req.cookies;

    console.log(req.cookies); // Log cookies for debugging

    if (!user) {
        return res.status(401).json({ message: "No cookie found" });
    }

    jwt.verify(user, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decode; // Attach the decoded user data to req.user
        console.log("Decoded user:", req.user);

        next(); // Proceed only after successful verification
    });
};