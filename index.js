const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const { errorHandler } = require("./util/middleware");

const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const blogsRouter = require("./controllers/blogs");
const authorsRouter = require("./controllers/authors");
const readinglistsRouter = require("./controllers/reading_lists");

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readinglistsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
