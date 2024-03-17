import styles from './Modal.module.scss'
import { CircleX } from 'lucide-react';
import TypingEffect from './TypingEffect';
import axios from 'axios';
import { useState } from 'react';

const Modal = ({ text = "", handleCloseModal, avatar = false }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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

            console.log(response.data);
            alert("Upload successful!");
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
                    {text && <TypingEffect text={text} speed={110} />}
                    {avatar
                        &&
                        <form onSubmit={handleSubmit}>
                            <input type="file" onChange={handleFileChange} />
                            <button type="submit">Upload</button>
                        </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default Modal;
