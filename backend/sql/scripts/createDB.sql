DROP TABLE IF EXISTS skins;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users (
        id INTEGER NOT NULL,
        username VARCHAR(25) NOT NULL UNIQUE,
        country TEXT NOT NULL,
        comp_points INTEGER DEFAULT 0 NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE
    skins (
        id INTEGER NOT NULL,
        code TEXT NOT NULL,
        skin_name VARCHAR(60) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        creator INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (creator) REFERENCES users (id)
    );