// src/components/PhotoDisplay.js
import React, { useState, useEffect } from 'react';
import app from '../firebase';
import { getStorage, ref, list, getDownloadURL } from 'firebase/storage';
import { styled } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// Use the styled utility to create a styled component
const ProgressContainer = styled('div')({
  padding: '16px',
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Progress = styled(LinearProgress)({
  width: '100%',
  marginTop: '16px',
});

const PhotoDisplay = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buildSteps, setBuildSteps] = useState([
    'Starting...',
    'Processing images...',
    'Connecting nodes...',
    'Finalizing 3D model...',
  ]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const storage = getStorage(app);
      const photoBucket = 'photos';

      try {
        const result = await list(ref(storage, photoBucket));
        const photoUrls = await Promise.all(
          result.items.map(async (item) => getDownloadURL(item))
        );

        setPhotos(photoUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress steps
      setProgress((prevProgress) => (prevProgress + 25) % 100);

      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [photos]);

  return (
    <div className="photo-display-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="photo-display">
          <div className="photo-container">
            <img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex]}
              alt="shuffling"
              className="shuffling-photo"
            />
          </div>
          <Paper>
            <ProgressContainer>
              {buildSteps.map((step, index) => (
                <div key={index}>
                  <Typography variant="body1">{step}</Typography>
                  <Progress variant="determinate" value={progress} />
                </div>
              ))}
            </ProgressContainer>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default PhotoDisplay;
