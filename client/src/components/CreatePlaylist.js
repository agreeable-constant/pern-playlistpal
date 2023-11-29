import React, { useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const CreatePlaylist = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [playlistUrl, setPlaylistUrl] = useState('');

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
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.user.id; // Adjust according to your token's payload structure

        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('playlistUrl', playlistUrl);
        formData.append('owner', userId);

        try {
            // Make an HTTP POST request to your server endpoint
            const response = await fetch("http://localhost:5000/create-playlist/", {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                // Handle the successful response from the server
                console.log('Playlist created successfully');
            } else {
                // Handle the error response from the server
                console.error('Failed to create playlist', response.status);
            }
        } catch (error) {
            // Handle any network or server errors
            console.error('An error occurred', error);
        }
    };

    return (
        <div>
            <h2>Create Playlist</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Playlist Name:
                        <input type="text" value={name} onChange={handleNameChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <input type="text" value={description} onChange={handleDescriptionChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Image:
                        <input type="file" onChange={handleImageChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Playlist URL:
                        <input type="text" value={playlistUrl} onChange={handlePlaylistUrlChange} />
                    </label>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreatePlaylist;
