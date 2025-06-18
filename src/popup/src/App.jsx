import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from "react";

// Mock data for development mode
const MOCK_URLS = [
  'https://github.com/vitejs/vite',
  'https://react.dev/',
  'https://www.example.com/very/long/path/with/parameters?id=123&tab=main',
  'https://stackoverflow.com/questions/react-hooks'
];

// QR code configuration
const QR_CONFIG = {
  width: 300,
  height: 300,
  dotsOptions: {
    color: "#4267b2",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#e9ebee",
  }
};

function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isExtensionMode, setIsExtensionMode] = useState(false);

  // Generate QR code with given URL
  const generateQRCode = (url) => {
    if (!url) return;
    
    const qrCode = new QRCodeStyling({
      ...QR_CONFIG,
      data: url
    });
    
    const container = document.getElementById('qrcode_container');
    if (container) {
      container.innerHTML = '';
      qrCode.append(container);
    }
  };

  // Get random mock URL
  const getRandomMockUrl = () => MOCK_URLS[Math.floor(Math.random() * MOCK_URLS.length)];

  // Load URL and generate QR code
  const loadUrlAndGenerateQR = () => {
    // Check if we're running in Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      setIsExtensionMode(true);
      chrome.tabs.query({ active: true, currentWindow: true })
        .then((tab) => {
          if (tab?.[0]?.url) {
            setCurrentUrl(tab[0].url);
            generateQRCode(tab[0].url);
          }
        })
        .catch(() => {
          // Fallback to mock data if Chrome API fails
          const mockUrl = getRandomMockUrl();
          setCurrentUrl(mockUrl);
          generateQRCode(mockUrl);
        });
    } else {
      // Development mode - use mock data
      setIsExtensionMode(false);
      const mockUrl = getRandomMockUrl();
      setCurrentUrl(mockUrl);
      generateQRCode(mockUrl);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (!isExtensionMode) {
      const mockUrl = getRandomMockUrl();
      setCurrentUrl(mockUrl);
      generateQRCode(mockUrl);
    }
  };

  useEffect(() => {
    const onPageLoad = () => loadUrlAndGenerateQR();

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
        QR Code Generator
      </h1>
      
      {!isExtensionMode && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          🛠️ Development Mode - Using mock data
        </div>
      )}
      
      <p style={{ marginBottom: '15px', fontSize: '16px', color: '#666' }}>
        {isExtensionMode ? 'Current Tab URL:' : 'Sample URL:'}
      </p>
      
      {currentUrl && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '5px',
          fontSize: '12px',
          wordBreak: 'break-all',
          maxWidth: '300px',
          margin: '0 auto 15px auto'
        }}>
          {currentUrl}
        </div>
      )}
      
      <div id="qrcode_container" style={{ marginBottom: '15px' }} />
      
      {!isExtensionMode && (
        <button 
          onClick={handleRefresh}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4267b2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Generate New QR Code
        </button>
      )}
    </div>
  );
}

export default App;
