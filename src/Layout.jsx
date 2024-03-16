import { Mic } from 'lucide-react'
import Navbar from './Navbar';
import styles from './Layout.module.scss'
import Modal from './Modal';
import { useState } from 'react';

export function Layout({ onRecordingComplete }) {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                let audioChunks = [];

                recorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                recorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    onRecordingComplete(audioBlob);
                    audioChunks = [];
                };

                recorder.start();
                setMediaRecorder(recorder);
                setIsRecording(true);
            } catch (error) {
                console.error('Error accessing the microphone', error);
            }
        } else {
            alert('Microphone access is not supported by your browser.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleClick = () => {
        const name = localStorage.getItem('userName')
        const token = localStorage.getItem('userToken')
        if (name && token) {
            if (!isRecording) {
                startRecording();
            }
            else
                stopRecording();
        }
        else {
            alert('You need to enter in your account, firstly!')
        }
    }

    return (
        <div>
            <Navbar />
            <Modal text={'cnsjkcnsdjk'} />
            <button className={styles.microphone} onClick={handleClick}>
                <Mic style={isRecording ? { stroke: '#308e30' } : { stroke: '#c83d3d' }} size={48} strokeWidth={1.75} />
            </button>
        </div>
    )
}