const Blog = require("./blog");
const User = require("./user");
const UserBlogs = require("./user_blogs");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserBlogs, as: "readings" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_bookmarked" });

User.hasMany(UserBlogs);
UserBlogs.belongsTo(User);

Blog.hasMany(UserBlogs, { as: "readinglists" });
UserBlogs.belongsTo(Blog);

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  UserBlogs,
};
