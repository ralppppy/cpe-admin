const router = require("express").Router()
const path = require("path")
const fs = require("fs")

//locahost:8080/news/news.jpg

//LOADING IMAGES
router.get("/news/:fileName", (req, res) => {
  let fileName = req.params.fileName

  const imagePath = path.resolve("public", "images", "news", fileName)

  if (require("fs").existsSync(imagePath)) {
    res.sendFile(path.resolve("public", "images", "news", fileName))
  } else {
    console.log("ERROR")
  }
})
//LOADING IMAGES
router.get("/skill/:fileName", (req, res) => {
  let fileName = req.params.fileName

  const imagePath = path.resolve("public", "images", "skill", fileName)

  if (require("fs").existsSync(imagePath)) {
    res.sendFile(path.resolve("public", "images", "skill", fileName))
  } else {
    console.log("ERROR")
  }
})

module.exports = router
