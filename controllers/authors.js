const router = require("express").Router();

const { Blog, User } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });

  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

module.exports = router;
