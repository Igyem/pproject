import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [confidence, setConfidence] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setPrediction('');
        setConfidence('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);

        try {
            const response = await fetch('https://your-app.onrender.com/predict', { // Update with your Render URL
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to get prediction");
            }

            const result = await response.json();
            setPrediction(result.class);
            setConfidence(result.confidence.toFixed(2));
        } catch (error) {
            console.error(error);
            alert("An error occurred!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Processing...' : 'Upload & Predict'}
            </button>
            {prediction && (
                <div className="result">
                    <h2>Prediction: {prediction}</h2>
                    <p>Confidence: {confidence}%</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
