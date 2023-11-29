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
  playlist_image bytea NOT NULL,
  playlist_url VARCHAR(255),
  playlist_owner uuid NOT NULL,
  PRIMARY KEY(playlist_id),
  FOREIGN KEY(playlist_owner) REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--playlist songs
CREATE TABLE songs(
  song_id uuid DEFAULT uuid_generate_v4(),
  song_name VARCHAR(255) NOT NULL,
  song_artist VARCHAR(255) NOT NULL,
  song_image VARCHAR(255),
  song_url VARCHAR(255) NOT NULL,
  playlist_id uuid NOT NULL,
  PRIMARY KEY(song_id),
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


--playliost analytics
CREATE TABLE playlist_analytics(
  playlist_analytics_id uuid DEFAULT uuid_generate_v4(),
  playlist_id uuid NOT NULL,
  playlist_analytics_date DATE NOT NULL,
  playlist_analytics_number_of_collaborators INT NOT NULL,
  PRIMARY KEY(playlist_analytics_id),
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--playlist collaboartors
CREATE TABLE playlist_collaborators(
  playlist_collaborators_id uuid DEFAULT uuid_generate_v4(),
  playlist_id uuid NOT NULL,
  collaborator_email VARCHAR(255) NOT NULL,
  PRIMARY KEY(playlist_collaborators_id),
  FOREIGN KEY(playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  FOREIGN KEY(collaborator_email) REFERENCES users(user_email) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
