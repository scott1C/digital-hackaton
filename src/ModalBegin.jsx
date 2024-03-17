import { useState, useEffect } from 'react';
import styles from './Modal.module.scss';
import { CircleX } from 'lucide-react';
import TypingEffect from './TypingEffect';

const ModalBegin = () => {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const hasModalBeenShown = localStorage.getItem('modalShown');
        if (!hasModalBeenShown) {
            setModalOpen(true);
            localStorage.setItem('modalShown', 'true');
        }
    }, []);

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
                            <TypingEffect text={"Bine ați venit la WLM,\npartenerul vostru înțelept pentru viață.\nCu WLM, puteți să-mi cereți orice,\nde la informații despre vreme sau știri\npână la programarea unor întâlniri\nsau găsirea persoanelor după fotografie."} speed={50} />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ModalBegin;
