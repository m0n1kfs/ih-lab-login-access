const createError = require("http-errors");
const User = require("../models/user.model");

module.exports.create = (req, res, next) => {
  const { name, email, password } = req.body;

  User.create({ name, email, password })
    .then((user) => {
      res.status(201).json({
        message: "User created",
        user,
      });
    })
    .catch(next);
};

module.exports.profile = (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "No user in session"));
  }
  res.json({
    message: "User profile",
    user: req.user,
  });
};
