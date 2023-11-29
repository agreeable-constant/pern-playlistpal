import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const createImageURLs = (playlists) => {
    return playlists.map(playlist => {
      const blob = new Blob([new Uint8Array(playlist.playlist_image.data)], { type: 'image/png' });
      const imageSrc = URL.createObjectURL(blob);
      return { ...playlist, imageSrc };
    });
  };

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "POST",
        headers: { jwt_token: localStorage.token },
      });
      const parseData = await res.json();
      setName(parseData.user_name);
      const playlistsWithImageURLs = createImageURLs(parseData.playlists || []);
      setPlaylists(playlistsWithImageURLs);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  // Cleanup Blob URLs on component unmount
  useEffect(() => {
    return () => {
      playlists.forEach(playlist => {
        URL.revokeObjectURL(playlist.imageSrc);
      });
    };
  }, [playlists]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <h1 className="mt-5">Playlist Hub</h1>
      <h2>Welcome {name}</h2>
      <button onClick={(e) => logout(e)} className="btn btn-primary logout-btn">
        Logout
      </button>{" "}
      <div className="playlists-container">
        {playlists.map((playlist) => (
          <div key={playlist.playlist_id} className="playlist-tile">
            <Link to={`/edit-playlist/${playlist.playlist_id}`}>
                <img src={playlist.imageSrc} alt={playlist.playlist_name} />
                <h3>{playlist.playlist_name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
