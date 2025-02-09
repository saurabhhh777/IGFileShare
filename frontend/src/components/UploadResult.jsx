import React, { useState, useEffect } from 'react';

const UploadResult = ({ fileUrl }) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <h3>File Uploaded Successfully!</h3>
      <p>Your file will expire in: <strong>{formatTime(timeLeft)}</strong></p>
      <p>Download Link: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
    </div>
  );
};

export default UploadResult;
