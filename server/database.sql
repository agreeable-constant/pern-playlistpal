CREATE DATABASE playlistpal;

--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY(user_id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE playlists(
  playlist_id uuid DEFAULT uuid_generate_v4(),
  playlist_name VARCHAR(255) NOT NULL,
  playlist_description VARCHAR(255) NOT NULL,
  playlist_image VARCHAR(255) NOT NULL,
  playlist_url VARCHAR(255) NOT NULL,
  playlist_owner uuid NOT NULL,
  PRIMARY KEY(playlist_id),
  FOREIGN KEY(playlist_owner) REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);