import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
      console.log(collaboratorData)

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
      const response = await fetch(`http://localhost:5000/edit-playlist/${playlistId}/songs`);
      const data = await response.json();
      setPlaylist(data);
    };
  
    // Fetch collaborators
    const fetchCollaborators = async () => {
      const response = await fetch(`http://localhost:5000/edit-playlist/${playlistId}/collaborators`);
      const data = await response.json();
      setCollaborators(data);
    };
  
    fetchSongs();
    fetchCollaborators();
  }, [playlistId]);
  

  return (
    <div>
      <h2>Edit Playlist</h2>

      {/* Form to add a new song */}
      <form onSubmit={addSong}>
        <input
          type="text"
          name="songName"
          value={songDetails.songName}
          onChange={handleSongDetailChange}
          placeholder="Song Name"
        />
        <input
          type="text"
          name="songArtist"
          value={songDetails.songArtist}
          onChange={handleSongDetailChange}
          placeholder="Artist Name"
        />
        <input
          type="text"
          name="songImage"
          value={songDetails.songImage}
          onChange={handleSongDetailChange}
          placeholder="Song Image URL (optional)"
        />
        <input
          type="text"
          name="songUrl"
          value={songDetails.songUrl}
          onChange={handleSongDetailChange}
          placeholder="Song URL"
        />
        <button type="submit">Add Song</button>
      </form>

      {/* Form to add a new collaborator */}
      <form onSubmit={addCollaborator}>
        <input
          type="email"
          value={newCollaboratorEmail}
          onChange={(e) => setNewCollaboratorEmail(e.target.value)}
          placeholder="Enter collaborator's email"
        />
        <button type="submit">Add Collaborator</button>
      </form>

      {/* Button to delete the entire playlist */}
      <button onClick={deletePlaylist}>Delete Playlist</button>

      <h2>Songs</h2>
{/* List of songs */}
{playlist.length > 0 ? (
  playlist.map(song => (
    <div key={song.song_id}>
      {song.song_name} - {song.song_artist}
      <button onClick={() => deleteSong(song.song_id)}>Delete</button>
    </div>
  ))
) : (
  <p>No songs in the playlist.</p>
)}

<h2>Collaborators</h2>
{/* List of collaborators */}
{collaborators.length > 0 ? (
  collaborators.map(collaborator => (
    <div key={collaborator.collaborator_id}>
      {collaborator.collaborator_email}
      <button onClick={() => deleteCollaborator(collaborator.collaborator_email)}>
        Delete
      </button>
    </div>
  ))
) : (
  <p>No collaborators in this playlist.</p>
)}
</div>

  );
};

export default EditPlaylist;
