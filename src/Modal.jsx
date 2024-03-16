import React, { useEffect, useState } from 'react';
import styles from './Modal.module.scss'
import { CircleX } from 'lucide-react';
import TypingEffect from './TypingEffect';


const Modal = ({ text }) => {
    const [modalOpen, setModalOpen] = useState(true);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            {modalOpen &&
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <button className={styles.closeButton} onClick={handleCloseModal}>
                                <CircleX size={24} strokeWidth={1.75} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <TypingEffect text={text} speed={50} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Modal;
