import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import Navbar from "./navbar";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

  const createImageURLs = (playlists) => {
    return playlists.map((playlist) => {
      const blob = new Blob([new Uint8Array(playlist.playlist_image.data)], {
        type: "image/png",
      });
      const imageSrc = URL.createObjectURL(blob);
      return { ...playlist, imageSrc };
    });
  };

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/dashboard/", {
        method: "POST",
        headers: { jwt_token: token },
      });
      const parseData = await res.json();
      setName(parseData.user_name);
      const playlistsWithImageURLs = createImageURLs(parseData.playlists || []);
      setPlaylists(playlistsWithImageURLs);    } catch (err) {
      console.error(err.message);
    }
  };

  // Cleanup Blob URLs on component unmount
  useEffect(() => {
    return () => {
      playlists.forEach((playlist) => {
        URL.revokeObjectURL(playlist.imageSrc);
      });
    };
  }, [playlists]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Navbar title="PlaylistPal" setAuth={setAuth}/>
      <Typography variant="h5" gutterBottom>
        Welcome {name}, here are your playlists:
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {playlists.map((playlist) => (
          <Grid item key={playlist.playlist_id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea
                component={Link}
                to={`/edit-playlist/${playlist.playlist_id}`}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={playlist.imageSrc}
                  alt={playlist.playlist_name}
                />
                <CardContent>
                  <Typography variant="h6">{playlist.playlist_name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
