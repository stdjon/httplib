/*----------------------------------------------------------------------------*/
/* Drop existing tables */

DROP TABLE IF EXISTS PostsRead, Posts, Threads, Users;


/*----------------------------------------------------------------------------*/
/* Create tables */

CREATE TABLE IF NOT EXISTS Users(
    Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(25),
    PwHash VARCHAR(256),
    Level INT UNSIGNED,
    Points INT,
    JoinDate DATETIME,
    Avatar BLOB,
    Motto VARCHAR(40),
    Location VARCHAR(40)
)
    ENGINE=INNODB
    CHARACTER SET utf8;


CREATE TABLE IF NOT EXISTS Threads(
    Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(80),
    UserId INT UNSIGNED,
    CreateDate DATETIME,
    FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE
)
    ENGINE=INNODB
    CHARACTER SET utf8;


CREATE TABLE IF NOT EXISTS Posts(
    Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Content TEXT,
    UserId INT UNSIGNED,
    ThreadId INT UNSIGNED,
    Points INT,
    CreateDate DATETIME,
    FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY(ThreadId) REFERENCES Threads(Id) ON DELETE CASCADE
)
    ENGINE=INNODB
    CHARACTER SET utf8;


CREATE TABLE IF NOT EXISTS PostsRead(
    Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    UserId INT UNSIGNED,
    ThreadId INT UNSIGNED,
    PostId INT UNSIGNED,
    FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY(ThreadId) REFERENCES Threads(Id) ON DELETE CASCADE,
    FOREIGN KEY(PostId) REFERENCES Posts(Id) ON DELETE CASCADE
)
    ENGINE=INNODB
    CHARACTER SET utf8;


CREATE TABLE IF NOT EXISTS Uploads(
    Id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(256),
    MimeType VARCHAR(40),
    Length INT UNSIGNED,
    Data BLOB
)
    ENGINE=INNODB
    CHARACTER SET utf8;


/*----------------------------------------------------------------------------*/
/* Populate tables with example data... */

INSERT INTO Users(Id, Name, PwHash, Level, Points, JoinDate) VALUES(1, 'jon', '', 0, 0, '2015-01-01');
INSERT INTO Users(Id, Name, PwHash, Level, Points, JoinDate) VALUES(2, 'user1', '', 0, 0, '2015-01-02');
INSERT INTO Users(Id, Name, PwHash, Level, Points, JoinDate) VALUES(3, 'user2', '', 0, 0, '2015-01-03');
INSERT INTO Users(Id, Name, PwHash, Level, Points, JoinDate) VALUES(4, 'blah', '', 0, 0, '2015-01-04');


INSERT INTO Threads(Id, Title, UserId, CreateDate) VALUES(1, 'test thread', 1, '2015-01-01');
INSERT INTO Threads(Id, Title, UserId, CreateDate) VALUES(2, 'Another Test Thread', 2, '2015-02-01');


INSERT INTO Posts(Id, Content, UserId, ThreadId, Points, CreateDate) VALUES(1, 'Test...', 1, 1, 0, '2015-01-03');
INSERT INTO Posts(Id, Content, UserId, ThreadId, Points, CreateDate) VALUES(2, 'Test...', 2, 2, 0, '2015-02-04');
INSERT INTO Posts(Id, Content, UserId, ThreadId, Points, CreateDate) VALUES(3, 'Test...', 3, 2, 0, '2015-02-05');


INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(1, 1, 1, 1);
INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(2, 2, 1, 1);
INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(3, 3, 1, 1);
INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(4, 1, 2, 2);
INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(5, 2, 2, 2);
INSERT INTO PostsRead(Id, UserId, ThreadId, PostId) VALUES(6, 3, 2, 2);


