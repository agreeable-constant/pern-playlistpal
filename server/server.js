const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());

//routes

app.use("/authentication", require("./routes/jwtAuth"));

app.use("/dashboard", require("./routes/dashboard"));

app.use("/create-playlist", require("./routes/playlists"));

app.use("/edit-playlist", require("./routes/editPlaylist"));

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});