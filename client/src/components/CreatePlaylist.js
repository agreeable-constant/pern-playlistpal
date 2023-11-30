import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "./navbar";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handlePlaylistUrlChange = (event) => {
    setPlaylistUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve the userId from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.user.id; // Adjust according to your token's payload structure

    // Create a FormData object to send the form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("playlistUrl", playlistUrl);
    formData.append("owner", userId);

    try {
      // Make an HTTP POST request to your server endpoint
      const response = await fetch("http://localhost:5000/create-playlist/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle the successful response from the server
        console.log("Playlist created successfully");
      } else {
        // Handle the error response from the server
        console.error("Failed to create playlist", response.status);
      }
    } catch (error) {
      // Handle any network or server errors
      console.error("An error occurred", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Navbar title="PlaylistPal" showLogout={true}/>
      <Typography variant="h5" mb={2}>
        Create Playlist
      </Typography>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Playlist Name"
          value={name}
          onChange={handleNameChange}
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          variant="outlined"
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="image-input">Image</InputLabel>
        <Input id="image-input" type="file" onChange={handleImageChange} />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Playlist URL"
          value={playlistUrl}
          onChange={handlePlaylistUrlChange}
          variant="outlined"
        />
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Create
      </Button>
    </Box>
  );
};

export default CreatePlaylist;
