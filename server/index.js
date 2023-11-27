const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');


//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

//create a user

app.post("/users", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const newUser = await pool.query(
            "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING*", [username, password, email]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//create a playlist

app.post("/playlists", async (req, res) => {
    try {
        const { name, description, user_id } = req.body;
        const newPlaylist = await pool.query(
            "INSERT INTO playlists (name, description, user_id) VALUES($1, $2, $3) RETURNING*", [name, description, user_id]
        );
        res.json(newPlaylist.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all playlists

app.get("/playlists", async (req, res) => {
    try {
        const allPlaylists = await pool.query("SELECT * FROM playlists");
        res.json(allPlaylists.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a playlist

app.get("/playlists/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await pool.query("SELECT * FROM playlists WHERE playlist_id = $1", [id]);
        res.json(playlist.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a playlist name and description

app.put("/playlists/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updatePlaylist = await pool.query(
            "UPDATE playlists SET name = $1, description = $2 WHERE playlist_id = $3", [name, description, id]
        );
        res.json("Playlist was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a playlist

app.delete("/playlists/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletePlaylist = await pool.query("DELETE FROM playlists WHERE playlist_id = $1", [id]);
        res.json("Playlist was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

//add a song to a playlist

app.post("/playlists/:id/songs", async (req, res) => {
    try {
        const { playlist_id, song_id } = req.body;
        const newSong = await pool.query(
            "INSERT INTO songs (playlist_id, song_id) VALUES($1, $2) RETURNING*", [playlist_id, song_id]
        );
        res.json(newSong.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//delete a song from a playlist

app.delete("/playlists/:id/songs", async (req, res) => {
    try {
        const { playlist_id, song_id } = req.body;
        const deleteSong = await pool.query("DELETE FROM songs WHERE playlist_id = $1 AND song_id = $2", [playlist_id, song_id]);
        res.json("Song was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

//get playlist analytics

app.get("/playlists/:id/analytics", async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await pool.query("SELECT * FROM playlists WHERE playlist_id = $1", [id]);
        res.json(playlist.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//add collaborator to playlist

app.post("/playlists/:id/collaborators", async (req, res) => {
    try {
        const { playlist_id, user_id } = req.body;
        const newCollaborator = await pool.query(
            "INSERT INTO collaborators (playlist_id, user_id) VALUES($1, $2) RETURNING*", [playlist_id, user_id]
        );
        res.json(newCollaborator.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
