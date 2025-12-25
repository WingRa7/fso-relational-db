const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const Session = require("../models/session");
const User = require("../models/user");

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.errors.map((e) => e.message) });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "invalid token" });
  }

  res.status(500).send({ error: "Server error" });
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  const user = await User.findByPk(req.decodedToken.id);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  if (user.disabled) {
    return res
      .status(401)
      .json({ error: "account disabled, please contact admin" });
  }

  const session = await Session.findOne({
    where: { token: authorization.substring(7) },
  });
  if (!session) {
    return res.status(401).json({ error: "session invalid" });
  }

  req.token = authorization.substring(7);

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
