import axios from "axios";

const handleRecordingComplete = (audioBlob) => {
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
            const category = chatGptResponse.data.category;

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
            console.log('Final response:', finalResponse.data);
        })
        .catch((error) => {
            console.error('Error processing the request:', error);
        });
};

export default handleRecordingComplete