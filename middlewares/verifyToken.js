const jwt = require("jsonwebtoken");
const httpStatus = require("../utils/httpStatus");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: httpStatus.ERROR, message: "You must be registered" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.tokenBearer = decodedToken;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: httpStatus.ERROR, message: "Wrong token" });
  }
};

module.exports = verifyToken;
