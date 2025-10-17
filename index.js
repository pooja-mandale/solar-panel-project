const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()
// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.use("/api/admin", require("./routes/admin.routes"))
app.use("/api/contact", require("./routes/contact.route"))
app.use("/api/user", require("./routes/user.route"))


app.use(/.*/, (req, res) => {
    res.status(404).json({ message: "Resours Not found" })
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "SERVER ERROR ", error: err.message })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED 🌻")
    app.listen(process.env.PORT, console.log("SERVER RUNNING 🏃‍♂️"))
})
