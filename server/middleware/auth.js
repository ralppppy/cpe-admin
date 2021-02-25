const jwt = require("jsonwebtoken");
const fs = require("fs");

const auth = (req, res, next) => {
  let token = req.cookies.token;
  // verify a token asymmetric
  let cert = fs.readFileSync(`${__dirname}/../key/public.key`);
  jwt.verify(token, cert, { algorithms: ["RS256"] }, function (err, decoded) {
    if (err) {
      req.success = false;
      res.clearCookie("token");
    } else {
      req.userData = decoded;
      req.success = true;
    }

    next();
  });
};

module.exports = auth;
