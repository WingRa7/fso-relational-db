const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

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

const tokenExtractor = (req, res, next) => {
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
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
