DROP TABLE IF EXISTS replays;

DROP TABLE IF EXISTS maps;

DROP TABLE IF EXISTS skins;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users
(
    id          INTEGER                            NOT NULL,
    username    VARCHAR(25)                        NOT NULL UNIQUE,
    country     TEXT                               NOT NULL,
    comp_points INTEGER  DEFAULT 0                 NOT NULL,
    created     DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    skins
(
    id      INTEGER                            NOT NULL,
    code    TEXT                               NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    creator INTEGER                            NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (creator) REFERENCES users (id)
);

CREATE TABLE
    maps
(
    id           INTEGER                            NOT NULL,
    title        VARCHAR(50)                        NOT NULL,
    author_medal DECIMAL(10, 2)                     NOT NULL,
    gold_medal   DECIMAL(10, 2)                     NOT NULL,
    silver_medal DECIMAL(10, 2)                     NOT NULL,
    bronze_medal DECIMAL(10, 2)                     NOT NULL,
    created      DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    creator      INTEGER                            NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (creator) REFERENCES users (id)
);

CREATE TABLE
    replays
(
    id      INTEGER                            NOT NULL,
    record  DECIMAL(10, 2)                     NOT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    driver  INTEGER                            NOT NULL,
    map     INTEGER                            NOT NULL,
    skin    INTEGER                            NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (driver) REFERENCES users (id),
    FOREIGN KEY (map) REFERENCES maps (id),
    FOREIGN KEY (skin) REFERENCES skins (id)
);