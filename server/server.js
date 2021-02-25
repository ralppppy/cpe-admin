const express = require("express")
const app = express()
const db = require("./config/database")
const cookieParser = require("cookie-parser")
const path = require("path")
const cors = require("cors")
const compression = require("compression")

require("dotenv").config()

const PORT = process.env.PORT || 8080

db.authenticate()
  .then(() => console.log("Database connected "))

  .catch((error) => console.log(error))

//MIDDLEWARE
app.use(compression())
app.use(cookieParser())
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: false }))

app.get("/test", (req, res) => {
  res.json({ message: "Test" })
})

app.use("/api/v1/auth", require("./routes/authentication"))

//GLOBAL ROUTES
app.use("/public/image", require("./routes/global/image"))
app.use("/api/v1/email", require("./routes/global/email"))

//ADMIN ROUTES
app.use("/api/v1/admin/news", require("./routes/admin/news"))
app.use("/api/v1/admin/skill", require("./routes/admin/skill"))
app.use("/api/v1/admin/about_us", require("./routes/admin/aboutUs"))

if (
  // process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "production"
) {
  app.use(express.static("./build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("./", "build", "index.html"))
  })
}

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
