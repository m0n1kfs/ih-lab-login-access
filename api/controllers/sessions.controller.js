const Session = require("../models/session.model");
const User = require("../models/user.model");
const createError = require("http-errors");

module.exports.create = (req, res, next) => {
  const { email, password } = req.body;

  // 1. find user by email
  User.findOne({ email })
  .then((user) => {
    if (!user) {
      throw createError(401, "Credenciales inválidas");
    }
  // 2. check password
    return user.checkPassword(password).then((match) => {
      if (!match) {
        throw createError(401, "Credenciales inválidas");
      }
  // 3. create session
      return Session.create({ user: user._id });
    });
  })
  .then((session) => {
  // 4. send session id in a cookie
    res.header("Set-Cookie", `session_id=${session._id.toString()}`);
    res.json({ message: "Sesión iniciada correctamente", sessionId: session._id });
  })
  .catch(next);
};

module.exports.destroy = (req, res, next) => {
  // access current request session. remove and send 204 status
  Session.findByIdAndDelete(req.session._id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
