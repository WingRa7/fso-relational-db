const router = require("express").Router();
const { User, Blog, UserBlogs } = require("../models");

router.post("/", async (req, res) => {
  const { blogId, userId } = req.body;

  const user = await User.findByPk(userId);
  const blog = await Blog.findByPk(blogId);

  if (!user) {
    return res.status(404).json({ error: "user was not found" });
  }

  if (!blog) {
    return res.status(404).json({ error: "blog was not found" });
  }

  const usersBlog = await UserBlogs.create({
    userId: user.id,
    blogId: blog.id,
  });

  return res.status(201).json(usersBlog);
});

module.exports = router;
