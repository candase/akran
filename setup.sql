DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reset_codes CASCADE;
DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS common_chat CASCADE;


CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_pic VARCHAR(255),
  bio VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE common_chat(
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message VARCHAR NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() at time zone 'utc')
);

INSERT INTO common_chat (sender_id, message) VALUES (23, 'HELlloooooo1');
INSERT INTO common_chat (sender_id, message) VALUES (24, 'HELlloooooo2');
INSERT INTO common_chat (sender_id, message) VALUES (47, 'HELlloooooo3');
INSERT INTO common_chat (sender_id, message) VALUES (88, 'HELlloooooo4');
INSERT INTO common_chat (sender_id, message) VALUES (99, 'HELllooooo5');
INSERT INTO common_chat (sender_id, message) VALUES (192, 'HELlloooooo6');
INSERT INTO common_chat (sender_id, message) VALUES (10, 'HELlloooooo7');
INSERT INTO common_chat (sender_id, message) VALUES (22, 'HELlloooooo8');
INSERT INTO common_chat (sender_id, message) VALUES (46, 'HELlloooooo9');
INSERT INTO common_chat (sender_id, message) VALUES (33, 'HELlloooooo10');