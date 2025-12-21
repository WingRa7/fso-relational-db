const router = require("express").Router();

const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const { Blog, User } = require("../models");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
    },
  });

  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const decodedToken = jwt.verify(getTokenFrom(req), SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findByPk(decodedToken.id);

  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.toJSON());
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  const decodedToken = jwt.verify(getTokenFrom(req), SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findByPk(decodedToken.id);

  if (!req.blog) {
    return res.status(404).json({ error: "blog was not found" });
  }

  if (req.blog.userId !== user.id) {
    return res
      .status(403)
      .json({ error: "only the creator of the blog can delete" });
  }

  await req.blog.destroy();
  console.log(req.blog.toJSON());
  return res.status(204).end();
});

module.exports = router;
