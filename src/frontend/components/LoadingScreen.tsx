import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    '🔍 Analyzing your CV...',
    '🤖 Optimizing content with AI...',
    '🎯 Tailoring to job requirements...',
    '📝 Generating document...',
    '✨ Almost done...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
      <p className="loading-message" key={messageIndex}>
        {messages[messageIndex]}
      </p>
      <p className="loading-subtext">This may take 30-60 seconds</p>
    </div>
  );
};

export default LoadingScreen;