const httpStatus = require("../utils/httpStatus");

const allowTo = (role) => {
  return (req, res, next) => {
    if (req.tokenBearer.role === role) {
      next();
    } else {
      res.status(401).json({
        status: httpStatus.ERROR,
        message:
          "You do not have permission to access this route, please log in",
      });
    }
  };
};

module.exports = allowTo;
