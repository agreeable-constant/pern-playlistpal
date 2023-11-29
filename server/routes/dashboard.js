const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.post("/", authorize, async (req, res) => {
  try {
      const user = await pool.query(
          "SELECT user_name FROM users WHERE user_id = $1",
          [req.user.id] 
      );

      const userPlaylists = await pool.query(
          "SELECT * FROM playlists WHERE playlist_owner = $1",
          [req.user.id]
      );

      res.json({
          user_name: user.rows[0].user_name,
          playlists: userPlaylists.rows
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
  }
});


module.exports = router;