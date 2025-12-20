const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { username, name, passwordHash };

  const savedUser = await User.create(newUser);
  res.status(201).json({ username, name });
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
