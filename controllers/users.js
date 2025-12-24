const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, Blog, UserBlogs } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
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
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: {
          exclude: ["userId", "createdAt", "updatedAt"],
        },
        through: {
          attributes: [],
        },
        include: [
          {
            model: UserBlogs,
            as: "readinglists",
            attributes: ["id", "read"],
            where: { userId: req.params.id },
          },
        ],
      },
    ],
  });

  if (user) {
    res.json({
      username: user.username,
      name: user.name,
      readingList: user.readings,
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
