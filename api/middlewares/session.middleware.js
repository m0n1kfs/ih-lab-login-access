const Session = require("../models/session.model");
const createError = require("http-errors");

module.exports.checkSession = (req, res, next) => {
  // find session id from cookie. imagine cookie is "session=1234; other=5678"
  const cookieHeader = req.get("Cookie");
  let sessionId;

  if (cookieHeader) {
    // Ejemplo de cookieHeader: "session_id=1234; otraCookie=5678"
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith("session_id="));

    if (sessionCookie) {
      sessionId = sessionCookie.split("=")[1];
    }
  }

  // Si no encontramos sessionId, devolvemos 401
  if (!sessionId) {
    return next(createError(401, "missing session from cookie header"));
  }

  // 1. find session by ID &  // 2. populate user field
  Session.findById(sessionId)
    .populate("user")
    .then((session) => {
        // 9. handle errors with 401 code
        if (!session) {
        throw createError(401, "invalid session");
      }
  // 3. update session last access
  session.lastAccess = Date.now();
  // 5. save session
  return session.save();
    })
    .then((session) => {
  // 6. leave user on req object
  req.user = session.user;
  // 7. leave session on req object
  req.session = session;
  // 8. continue to next middleware or controller
  next();
    })
    .catch(next);
};