import { useState } from 'react';
import { Mic } from 'lucide-react'
import Navbar from './Navbar';
import styles from './Layout.module.scss'
import Modal from './Modal';
import axios from 'axios';

export function Layout() {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [information, setInformation] = useState('')
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenPerson, setModalOpenPerson] = useState(false);

    const handleRecordingComplete = (audioBlob) => {
        let category;
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.mp3'); // 'audio.wav' is the filename. You can change this as needed.

        // Update the URL to match your server configuration
        const transformURL = 'http://192.168.8.100:5000/transform';
        const structurizeURL = 'http://192.168.8.100:5000/structurize';
        const weatherURL = 'http://192.168.8.100:5000/weather';
        const newsURL = 'http://192.168.8.100:5000/news';
        const personSearchURL = 'http://192.168.8.100:5000/person-search';
        const createMeeting = 'http://192.168.8.100:5000/meeting';

        axios.post(transformURL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                console.log('Server response:', response.data);
                const transcription = response.data.transcription;
                // Return this promise so the next .then() waits for it
                return axios.post(structurizeURL, { transcription: transcription }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            })
            .then((chatGptResponse) => {
                // This now properly waits for the axios.post to structurize to complete
                console.log('ChatGPT response:', chatGptResponse.data);
                category = chatGptResponse.data.category;

                // Determine which endpoint to call based on the category
                let targetURL;
                switch (category) {
                    case 'weather':
                        targetURL = weatherURL;
                        break;
                    case 'news':
                        targetURL = newsURL;
                        break;
                    case 'person-search':
                        targetURL = personSearchURL;
                        setModalOpenPerson(true)
                        break;
                    case 'meeting':
                        targetURL = createMeeting;
                        break;
                    default:
                        console.error('Unknown category:', category);
                        return Promise.reject('Unknown category');
                }
                // Perform the request to the targeted endpoint. Adjust the request as needed based on expected parameters.
                // For demonstration, assuming additional_data is used as a query for these endpoints.
                const additionalData = chatGptResponse.data.additional_data;
                return axios.post(targetURL, { query: additionalData }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            })
            .then((finalResponse) => {
                if (finalResponse.data.message) {
                    const text = "You have entered a wrong data, try again!"
                    setInformation(text)
                    setModalOpen(true)
                }
                else {
                    if (category === 'weather') {
                        const text = `Temperature: ${finalResponse.data.temperature}\nDescription: ${finalResponse.data.description}\nHumidity: ${finalResponse.data.humidity}\nWind Speed: ${finalResponse.data.wind_speed}`
                        setInformation(text)
                        setModalOpen(true)
                    }
                    else if (category === 'news') {
                        setInformation(finalResponse.data.response)
                        setModalOpen(true)
                    }
                    else if (category === 'person-search') {
                        setModalOpenPerson(false)
                        const text = `${finalResponse.data.links[0]}\n${finalResponse.data.links[1]}\n${finalResponse.data.links[2]}`
                        setInformation(text)
                        setModalOpen(true)
                    }
                }
            })
            .catch((error) => {
                console.error('Error processing the request:', error);
            });
    };

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
                    handleRecordingComplete(audioBlob);
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

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClosePersonModal = () => {
        setModalOpenPerson(false);
    }

    return (
        <div>
            <Navbar />
            {modalOpen && <Modal text={information} handleCloseModal={handleCloseModal} />}
            {modalOpenPerson && <Modal handleCloseModal={handleClosePersonModal} avatar={true} />}
            <button className={styles.microphone} onClick={handleClick}>
                <Mic style={isRecording ? { stroke: '#308e30' } : { stroke: '#c83d3d' }} size={48} strokeWidth={1.75} />
            </button>
        </div>
    )
}