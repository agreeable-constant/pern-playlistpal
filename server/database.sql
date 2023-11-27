CREATE DATABASE playlistpal;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE playlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  description VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE songs (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES playlists(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE collaborators (
  playlist_id INTEGER REFERENCES playlists(id) NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  can_edit BOOLEAN NOT NULL
);

CREATE TABLE playlist_analytics (
  playlist_id INTEGER REFERENCES playlists(id) NOT NULL,
  plays_count INTEGER NOT NULL,
  likes_count INTEGER NOT NULL,
  songs_added INTEGER NOT NULL,
  songs_removed INTEGER NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
  