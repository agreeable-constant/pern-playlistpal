const router = require("express").Router();
const pool = require("../db");
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const { name, description, owner } = req.body;  // Assuming 'owner' contains the user ID
        console.log(req.body);

        const image = req.file; // The uploaded file information

        // Read the image file as a binary buffer
        const imageBuffer = fs.readFileSync(image.path);
        // Insert the data into the database
        const newPlaylist = await pool.query(
            "INSERT INTO playlists (playlist_name, playlist_image, playlist_description, playlist_owner) VALUES($1, $2, $3, $4) RETURNING *",
            [name, imageBuffer, description, owner]
        );

        // Delete the temporary file
        fs.unlinkSync(image.path);

        res.json(newPlaylist.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
