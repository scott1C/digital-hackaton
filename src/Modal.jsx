import React, { useState } from 'react';
import styles from './Modal.module.scss';
import { CircleX } from 'lucide-react';
import axios from 'axios';

const Modal = ({ text = "", handleCloseModal, onUploadSuccess, avatar = false }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const renderTextWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{part}</a>;
            } else {
                return part;
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        try {
            const response = await axios.post('http://192.168.8.100:5000/person-search', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Upload successful!");
            if (onUploadSuccess) {
                onUploadSuccess(response.data); // Call the callback with the server response
            }
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error("Error uploading the file", error);
            alert("Failed to upload the file.");
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={handleCloseModal}>
                        <CircleX size={24} strokeWidth={1.75} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {text && <pre>{renderTextWithLinks(text)}</pre>}
                    {avatar && (
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleFileChange} />
                            <button type="submit">Upload</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
