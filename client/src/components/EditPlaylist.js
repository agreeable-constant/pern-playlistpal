import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
    Container,
} from "@mui/material";
import Navbar from "./navbar";

const EditPlaylist = () => {
  const [playlist, setPlaylist] = useState([]); // Holds the list of songs
  const [collaborators, setCollaborators] = useState([]); // Holds the list of collaborators
  const [songDetails, setSongDetails] = useState({
    songName: "",
    songArtist: "",
    songImage: "",
    songUrl: "",
  });
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const { playlistId } = useParams();

  const handleSongDetailChange = (e) => {
    setSongDetails({ ...songDetails, [e.target.name]: e.target.value });
  };

  const addSong = async (e) => {
    e.preventDefault();

    const songData = {
      song_name: songDetails.songName,
      song_artist: songDetails.songArtist,
      song_image: songDetails.songImage,
      song_url: songDetails.songUrl,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/edit-playlist/${playlistId}/songs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(songData),
        }
      );

      if (response.ok) {
        console.log("Song added successfully");
        // Update local state or fetch updated playlist data
      } else {
        console.error("Failed to add song", response.status);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }

    // Resetting the form
    setSongDetails({
      songName: "",
      songArtist: "",
      songImage: "",
      songUrl: "",
    });
  };

  const deleteSong = async (songId) => {
    const playlistId = "your-playlist-id"; // Replace with actual playlist ID

    try {
      const response = await fetch(
        `http://localhost:5000/playlist/${playlistId}/songs/${songId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Song deleted successfully");
        // Update local state or fetch updated playlist data
      } else {
        console.error("Failed to delete song", response.status);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const deletePlaylist = () => {
    // Logic to delete the playlist
    setPlaylist([]);
  };

  const addCollaborator = async (e) => {
    e.preventDefault();

    const collaboratorData = {
      collaborator_email: newCollaboratorEmail, // Assuming collaboratorId is the email, adjust if necessary
    };

    try {
      const response = await fetch(
        `http://localhost:5000/edit-playlist/${playlistId}/collaborators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(collaboratorData),
        }
      );
      console.log(collaboratorData);

      if (response.ok) {
        console.log("Collaborator added successfully");
        // Optionally, update local state or fetch updated collaborators data
      } else {
        console.error("Failed to add collaborator", response.status);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }

    setNewCollaboratorEmail(""); // Reset the input field
  };

  const deleteCollaborator = async (collaboratorEmail) => {
    const playlistId = "your-playlist-id"; // Replace with actual playlist ID

    try {
      const response = await fetch(
        `http://localhost:5000/playlist/${playlistId}/collaborators/${collaboratorEmail}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Collaborator deleted successfully");
        // Optionally, update local state or fetch updated collaborators data
      } else {
        console.error("Failed to delete collaborator", response.status);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
    // Inside deleteCollaborator function, after the fetch call and response check
    const updatedCollaborators = collaborators.filter(
      (c) => c.email !== collaboratorEmail
    );
    setCollaborators(updatedCollaborators);
  };

  useEffect(() => {
    // Fetch songs
    const fetchSongs = async () => {
      const response = await fetch(
        `http://localhost:5000/edit-playlist/${playlistId}/songs`
      );
      const data = await response.json();
      setPlaylist(data);
    };

    // Fetch collaborators
    const fetchCollaborators = async () => {
      const response = await fetch(
        `http://localhost:5000/edit-playlist/${playlistId}/collaborators`
      );
      const data = await response.json();
      setCollaborators(data);
    };

    fetchSongs();
    fetchCollaborators();
  }, [playlistId]);

  return (
    <Container maxWidth="md">
      <Navbar title="PlaylistPal" showLogout={true} />
      <Typography variant="h4" gutterBottom>
        Edit Playlist
      </Typography>
      <form onSubmit={addSong}>
        <TextField
          label="Song Name"
          name="songName"
          value={songDetails.songName}
          onChange={handleSongDetailChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <TextField
          label="Artist Name"
          name="songArtist"
          value={songDetails.songArtist}
          onChange={handleSongDetailChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField
          label="Song Image URL (optional)"
          name="songImage"
          value={songDetails.songImage}
          onChange={handleSongDetailChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField
          label="Song URL"
          name="songUrl"
          value={songDetails.songUrl}
          onChange={handleSongDetailChange}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button type="submit" color="primary" variant="contained">
          Add Song
        </Button>
      </form>
      <form onSubmit={addCollaborator}>
        <TextField
          label="Collaborator's Email"
          type="email"
          value={newCollaboratorEmail}
          onChange={(e) => setNewCollaboratorEmail(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <Button type="submit" color="primary" variant="contained">
          Add Collaborator
        </Button>
      </form>
      {/* Button to delete the entire playlist */}
      <Button onClick={deletePlaylist} color="secondary" variant="contained">
        Delete Playlist
      </Button>
      <Typography variant="h6">Songs</Typography>
      <List>
        {playlist.length > 0 ? (
          playlist.map((song) => (
            <React.Fragment key={song.song_id}>
              <ListItem>
                <ListItemText
                  primary={`${song.song_name} - ${song.song_artist}`}
                />
                <Button
                  onClick={() => deleteSong(song.song_id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography>No songs in the playlist.</Typography>
        )}
      </List>
      <Typography variant="h6">Collaborators</Typography>
      <List>
        {collaborators.length > 0 ? (
          collaborators.map((collaborator) => (
            <React.Fragment key={collaborator.collaborator_id}>
              <ListItem>
                <ListItemText primary={collaborator.collaborator_email} />
                <Button
                  onClick={() =>
                    deleteCollaborator(collaborator.collaborator_email)
                  }
                  color="secondary"
                >
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography>No collaborators in this playlist.</Typography>
        )}
      </List>
    </Container>
  );
};

export default EditPlaylist;
