import React, { useState } from "react";

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

    const handleSongDetailChange = (e) => {
        setSongDetails({ ...songDetails, [e.target.name]: e.target.value });
    };

    const addSong = (e) => {
        e.preventDefault();
        // Logic to add a new song to the playlist
        const newSong = {
            name: songDetails.songName,
            artist: songDetails.songArtist,
            image: songDetails.songImage,
            url: songDetails.songUrl,
            id: Date.now(), // Generate a unique ID for the song
        };
        setPlaylist([...playlist, newSong]);

        // Resetting the form
        setSongDetails({
            songName: "",
            songArtist: "",
            songImage: "",
            songUrl: "",
        });
    };

    const deleteSong = (songId) => {
        // Logic to delete a song from the playlist
        const updatedPlaylist = playlist.filter((song) => song.id !== songId);
        setPlaylist(updatedPlaylist);
    };

    const deletePlaylist = () => {
        // Logic to delete the playlist
        setPlaylist([]);
    };

    const addCollaborator = (e) => {
        e.preventDefault();
        // Logic to add a collaborator to the playlist
        const newCollaborator = {
            email: newCollaboratorEmail,
        };
        setCollaborators([...collaborators, newCollaborator]);
        setNewCollaboratorEmail(""); // Reset after adding
    };

    const deleteCollaborator = (collaboratorEmail) => {
        // Logic to delete a collaborator from the playlist
        const updatedCollaborators = collaborators.filter(
            (collaborator) => collaborator.email !== collaboratorEmail
        );
        setCollaborators(updatedCollaborators);
    };

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
            {playlist.map((song, index) => (
                <div key={index}>
                    {song.name} - {song.artist}
                    <button onClick={() => deleteSong(song.id)}>Delete</button>
                </div>
            ))}

            <h2>Collaborators</h2>
            {/* List of collaborators */}
            {collaborators.map((collaborator, index) => (
                <div key={index}>
                    {collaborator.email}
                    <button onClick={() => deleteCollaborator(collaborator.email)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default EditPlaylist;
