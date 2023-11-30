
// Import necessary modules and dependencies
const express = require('express');
const router = express.Router();
const pool = require("../db");

// Add a song to a playlist
router.post('/:playlistId/songs', async (req, res) => {
    const { playlistId } = req.params;
    const { song_name, song_artist, song_image, song_url } = req.body;
  
    try {  
      const result = await pool.query(
        `INSERT INTO songs (song_name, song_artist, song_image, song_url, playlist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [song_name, song_artist, song_image, song_url, playlistId]
      );
  
      res.status(200).json({ message: 'Song added to playlist', song: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
    }
  });
  

// Delete a song from a playlist
router.delete('/:playlistId/songs/:songId', async (req, res) => {
    const { playlistId, songId } = req.params;
  
    try {  
      await pool.query(`DELETE FROM songs WHERE song_id = $1`, [songId]);
  
      res.status(200).json({ message: 'Song deleted from playlist' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting song from playlist', error: error.message });
    }
  });
  

// Delete a playlist
router.delete('/playlist/:playlistId', async (req, res) => {
        const { playlistId } = req.params;
    
        try {
            const playlistExists = await pool.query(`SELECT * FROM playlists WHERE playlist_id = $1`, [playlistId]);
            
            if (playlistExists.rows.length === 0) {
                return res.status(404).json({ message: 'Playlist not found' });
            }
            
            await pool.query(`DELETE FROM playlists WHERE playlist_id = $1`, [playlistId]);
    
            res.status(200).json({ message: 'Playlist deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting playlist', error: error.message });
        }
    });
  
// Add a collaborator to a playlist
router.post('/:playlistId/collaborators', async (req, res) => {
    const { playlistId } = req.params;
    const { collaborator_email } = req.body;

    try {
        // Fetch user_id and user_name based on the given email
        const userResult = await pool.query(
            `SELECT user_id, user_name FROM users WHERE user_email = $1`,
            [collaborator_email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract user_id and user_name
        const { user_id: userId, user_name: userName } = userResult.rows[0];

        // Insert into playlist_collaborators
        const result = await pool.query(
            `INSERT INTO playlist_collaborators (playlist_id, collaborator_id, collaborator_name, collaborator_email) VALUES ($1, $2, $3, $4) RETURNING *`,
            [playlistId, userId, userName, collaborator_email]
        );

        res.status(200).json({ message: 'Collaborator added to playlist', collaborator: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding collaborator to playlist', error: error.message });
    }
});




// Delete a collaborator from a playlist by email
router.delete('/:playlistId/collaborators/:email', async (req, res) => {
    const { playlistId, collaborator_email } = req.params;

    try {
        await pool.query(
            `DELETE FROM playlist_collaborators WHERE playlist_id = $1 AND collaborator_email = $2`,
            [playlistId, collaborator_email]
        );

        res.status(200).json({ message: 'Collaborator deleted from playlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting collaborator from playlist', error: error.message });
    }
});

// Get all collaborators of a playlist
router.get('/:playlistId/collaborators', async (req, res) => {
    const { playlistId } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM playlist_collaborators WHERE playlist_id = $1`,
            [playlistId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collaborators from playlist', error: error.message });
    }
});

// Get all songs of a playlist
router.get('/:playlistId/songs', async (req, res) => {
    const { playlistId } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM songs WHERE playlist_id = $1`,
            [playlistId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs from playlist', error: error.message });
    }
});



module.exports = router;