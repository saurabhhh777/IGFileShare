import React, { useState } from 'react';
import DragDropZone from './components/DragDropZone';
import UploadResult from './components/UploadResult';
import './App.css';

const App = () => {
  const [fileUrl, setFileUrl] = useState('');

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setFileUrl(data.link))
      .catch((error) => console.error('File upload failed:', error));
  };

  return (
    <div className="App">
      <h1>Temporary File Sharing</h1>
      {!fileUrl ? (
        <DragDropZone onFileUpload={handleFileUpload} />
      ) : (
        <UploadResult fileUrl={fileUrl} />
      )}
    </div>
  );
};

export default App;
