const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], "gadhani");
      if (decoded) {
        req.body.autherID = decoded.autherID;
        next();
      } else {
        res.send({ msg: "Please Login First" });
      }
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  } else {
    res.send({ msg: "Please Login First" });
  }
};
module.exports = auth;
