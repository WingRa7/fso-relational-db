CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
author TEXT,
url TEXT NOT NULL,
title TEXT NOT NULL,
likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES ('Dan Abramov', 'http://www.techblog.com/blog/1', 'On let vs const');

INSERT INTO blogs (author, url, title) 
VALUES ('Laurenz Albe', 'http://www.techblog.com/blog/2', 'Gaps in sequences in PostgreSQL');