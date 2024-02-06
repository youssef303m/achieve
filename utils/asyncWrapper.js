const httpStatus = require("./httpStatus");

module.exports = (asyncFn) => {
  return (req, res, next) => {
    asyncFn(req, res, next).catch((err) => {
      return res
        .status(500)
        .json({ status: httpStatus.ERROR, message: err.message });
    });
  };
};
