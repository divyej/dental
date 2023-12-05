import React, { useState, useEffect } from "react";
import app from "../firebase";

import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import image from "./asset/13824bb1d54370aa191ace2385809594.gif";

// Use the styled utility to create a styled component
const ProgressContainer = styled("div")({
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    backgroundColor: "black", // Dark blue background color
  });
  
  const ProgressBox = styled(Paper)({
    marginBottom: "16px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor:"black",// Slightly lighter blue background color
    color: "white",
    display: "flex",
    alignItems: "center",
  });
  
  const Progress = styled(LinearProgress)({
    flex: 1,
    marginLeft: "8px",
    backgroundColor: "#1a237e", // Darker blue progress bar color
    borderRadius: "4px",
  });
  
  const Overlay = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
 
  });
  
  const PhotoContainer = styled("div")({
    position: "relative",
    width: "100%",
    paddingTop: "75%",
    backgroundColor: "#1a237e", // Dark blue background color
  });
  
  const ShufflingPhoto = styled("img")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    animation: "shuffleAnimation 0.5s infinite alternate",
    borderRadius: "8px", // Add border radius to the photo
  });
  const ArrowIcon = styled(ArrowForwardIcon)({
    marginRight: "8px",
    color: "white",
  });


const PhotoDisplay = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [buildSteps, setBuildSteps] = useState([
    "Starting server...",
    "Processing images...",
    "Connecting nodes...",
  ]);

  const displayLogsAndGif = async () => {
    const logsCopy = [...logs];

    for (let i = 0; i < buildSteps.length; i++) {
      setProgress(0);
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);

      // Introduce a delay before displaying the build log
      await new Promise((resolve) => setTimeout(resolve, 2000));

      logsCopy.push(buildSteps[i]);

      // Introduce a delay before moving to the next step
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Add an additional delay before showing the GIF
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLogs(logsCopy);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const storage = getStorage(app);
      const photoBucket = "images"; // your storage bucket path

      try {
        const result = await list(ref(storage, photoBucket));
        const photoUrls = await Promise.all(
          result.items.map(async (item) => getDownloadURL(item))
        );

        setPhotos(photoUrls);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    // Use setInterval to update the current photo index every 1 second for rapid shuffling
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [photos]);

  useEffect(() => {
    if (!loading && logs.length === 0) {
      // Trigger the function to display logs and GIF only once when loading is complete
      displayLogsAndGif();
    }
  }, [loading, logs]);

  return (
    <Grid container spacing={2} className="photo-display-container">
      <Grid item xs={8}>
        <PhotoContainer>
          <ShufflingPhoto
            key={currentPhotoIndex}
            src={photos[currentPhotoIndex]}
            alt="shuffling"
          />
          <Overlay>
            <CircularProgress />
            <Typography variant="body1">
              Model is processing images to create a 3D view...
            </Typography>
       
          </Overlay>

        </PhotoContainer>
      </Grid>
      <Grid item xs={4}>
        <Paper>
          <ProgressContainer>
            <Typography variant="h6" style={{ marginBottom: "16px" }}>
              Development Dashboard
            </Typography>
            {logs.map((log, index) => (
              <ProgressBox key={index}>
                <ArrowIcon />
                <Typography variant="h5">{buildSteps[index]}</Typography>
                <Progress variant="determinate" value={progress} />
              </ProgressBox>
            ))}
            {logs.length === 0 && (
              <Typography variant="body1">
                Waiting for server to start...
              </Typography>
            )
            }
           {logs.length===buildSteps.length && <img src={image} alt="gif" />}
          </ProgressContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PhotoDisplay;
