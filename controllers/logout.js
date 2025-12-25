const router = require("express").Router();

const Session = require("../models/session");

const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  try {
    await Session.destroy({
      where: { token: req.token },
    });
    return res.status(200).json({ message: "logged out" });
  } catch {
    return res.status(404).json({ error: "session not found" });
  }
});

module.exports = router;
