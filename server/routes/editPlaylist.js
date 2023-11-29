
// Import necessary modules and dependencies
const express = require('express');
const router = express.Router();

// Add a song to a playlist
router.post('/playlist/:playlistId/songs', async (req, res) => {
    const { playlistId } = req.params;
    const { song_name, song_artist, song_image, song_url } = req.body;
  
    try {
      // Validate playlistId existence...
  
      const result = await db.query(
        `INSERT INTO songs (song_name, song_artist, song_image, song_url, playlist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [song_name, song_artist, song_image, song_url, playlistId]
      );
  
      res.status(200).json({ message: 'Song added to playlist', song: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
    }
  });
  

// Delete a song from a playlist
router.delete('/playlist/:playlistId/songs/:songId', async (req, res) => {
    const { playlistId, songId } = req.params;
  
    try {
      // Optionally validate that the song belongs to the given playlistId...
  
      await db.query(`DELETE FROM songs WHERE song_id = $1`, [songId]);
  
      res.status(200).json({ message: 'Song deleted from playlist' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting song from playlist', error: error.message });
    }
  });
  

// Delete a playlist
router.delete('/playlist/:playlistId', async (req, res) => {
        const { playlistId } = req.params;
    
        try {
            const playlistExists = await db.query(`SELECT * FROM playlists WHERE playlist_id = $1`, [playlistId]);
            
            if (playlistExists.rows.length === 0) {
                return res.status(404).json({ message: 'Playlist not found' });
            }
            
            await db.query(`DELETE FROM playlists WHERE playlist_id = $1`, [playlistId]);
    
            res.status(200).json({ message: 'Playlist deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting playlist', error: error.message });
        }
    });
  

// Add a collaborator to a playlist
router.post('/playlist/:playlistId/collaborators', async (req, res) => {
    const { playlistId } = req.params;
    const { collaboratorId } = req.body; // collaboratorId should be passed in the request body
  
    try {
      // Validate playlistId and collaboratorId...
  
      const result = await db.query(
        `INSERT INTO playlist_collaborators (playlist_id, collaborator_id) VALUES ($1, $2) RETURNING *`,
        [playlistId, collaboratorId]
      );
  
      res.status(200).json({ message: 'Collaborator added to playlist', collaborator: result.rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error adding collaborator to playlist', error: error.message });
    }
  });
  

// Delete a collaborator from a playlist
router.delete('/playlist/:playlistId/collaborators/:collaboratorId', async (req, res) => {
    const { playlistId, collaboratorId } = req.params;
  
    try {
      await db.query(
        `DELETE FROM playlist_collaborators WHERE playlist_id = $1 AND collaborator_id = $2`,
        [playlistId, collaboratorId]
      );
  
      res.status(200).json({ message: 'Collaborator deleted from playlist' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting collaborator from playlist', error: error.message });
    }
  });

module.exports = router;