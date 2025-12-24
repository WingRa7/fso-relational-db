const router = require("express").Router();
const { User, Blog, UserBlogs } = require("../models");
const { tokenExtractor } = require("../util/middleware");

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

router.put("/:id", tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id;
  const userBlog = await UserBlogs.findByPk(req.params.id);

  if (!userBlog) {
    return res.status(404).json({ error: "reading list item not found" });
  }

  if (userId != userBlog.userId) {
    return res
      .status(401)
      .json({ error: "you can only update your own reading list" });
  }

  userBlog.read = req.body.read;
  await userBlog.save();
  return res.status(200).json(userBlog);
});

module.exports = router;
