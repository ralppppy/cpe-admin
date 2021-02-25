const jwt = require("jsonwebtoken");
const fs = require("fs");

const authNormal = (req, res, next) => {
  let token = req.cookies.token;

  // verify a token asymmetric
  let cert = fs.readFileSync(`${__dirname}/../key/public.key`);
  jwt.verify(token, cert, { algorithms: ["RS256"] }, function (err, decoded) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
      res.clearCookie("token");
    } else {
      req.userData = decoded;
      req.success = true;
    }

    next();
  });
};

module.exports = authNormal;
