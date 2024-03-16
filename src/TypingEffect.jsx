import { useState, useEffect } from "react";

const TypingEffect = ({ text, speed }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const typingTimer = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingTimer);
            }
        }, speed);

        return () => clearInterval(typingTimer);
    }, [text, speed]);

    return <p>{displayText}</p>;
};

export default TypingEffect