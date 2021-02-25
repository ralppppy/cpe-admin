const router = require("express").Router();
const Admin = require("../models/admin/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const fs = require("fs");

router.post("/login", (req, res) => {
  let { userName, password } = req.body;

  Admin.findOne({ where: { userName } })
    .then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });

      bcrypt.compare(password, user.password).then((isPasswordCorrect) => {
        if (!isPasswordCorrect)
          res.status(403).json({ message: "Incorrect username or password" });

        let { id, userName, email, firstName, lastName } = user;
        let privateKey = fs.readFileSync(`${__dirname}/../key/private.key`);

        jwt.sign(
          { id, userName, email, firstName, lastName },
          privateKey,
          { algorithm: "RS256" },
          function (err, token) {
            if (err)
              res
                .status(500)
                .json({ success: false, message: "Something went wrong" });

            let maxAge = 1000 * 60 * 60 * 8; //8 hours
            res
              .cookie("token", token, {
                maxAge,
                httpOnly: true,
              })
              .status(200)
              .json({
                success: true,
                userData: { id, userName, email, firstName, lastName },
              });
          }
        );
      });
    })
    .catch((error) => console.log(error));
});

router.post("/", auth, (req, res) => {
  let { userData, success } = req;
  if (success) {
    res.json({ success: true, userData });
  } else {
    res.json({ success: false, message: "Something went wrong" });
  }
});

module.exports = router;
