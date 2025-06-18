import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from "react";

// Mock data for development mode
const MOCK_DATA = [
  'https://github.com/vitejs/vite',
  'https://react.dev/',
  'Contact: john.doe@example.com\nPhone: +1-234-567-8900',
  'WiFi:T:WPA;S:MyNetwork;P:password123;H:false;'
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
  const [originalData, setOriginalData] = useState(''); // Original content from page/mock
  const [currentData, setCurrentData] = useState(''); // Current content (editable)
  const [isExtensionMode, setIsExtensionMode] = useState(false);

  // Generate QR code with given data
  const generateQRCode = (data) => {
    if (!data) return;
    
    const qrCode = new QRCodeStyling({
      ...QR_CONFIG,
      data: data
    });
    
    const container = document.getElementById('qrcode_container');
    if (container) {
      container.innerHTML = '';
      qrCode.append(container);
    }
  };

  // Get random mock data
  const getRandomMockData = () => MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)];

  // Load initial content and generate QR code
  const loadInitialData = () => {
    // Check if we're running in Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      setIsExtensionMode(true);
      chrome.tabs.query({ active: true, currentWindow: true })
        .then((tab) => {
          if (tab?.[0]?.url) {
            const url = tab[0].url;
            setOriginalData(url);
            setCurrentData(url);
            generateQRCode(url);
          }
        })
        .catch(() => {
          // Fallback to mock data if Chrome API fails
          const mockData = getRandomMockData();
          setOriginalData(mockData);
          setCurrentData(mockData);
          generateQRCode(mockData);
        });
    } else {
      // Development mode - use mock data
      setIsExtensionMode(false);
      const mockData = getRandomMockData();
      setOriginalData(mockData);
      setCurrentData(mockData);
      generateQRCode(mockData);
    }
  };

  // Handle content input change
  const handleDataChange = (e) => {
    const newData = e.target.value;
    setCurrentData(newData);
    generateQRCode(newData);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (isExtensionMode) {
      // In extension mode, get current tab URL again
      chrome.tabs.query({ active: true, currentWindow: true })
        .then((tab) => {
          if (tab?.[0]?.url) {
            const url = tab[0].url;
            setOriginalData(url);
            setCurrentData(url);
            generateQRCode(url);
          }
        })
        .catch(() => {
          setCurrentData(originalData);
          generateQRCode(originalData);
        });
    } else {
      // In development mode, generate new random data
      const mockData = getRandomMockData();
      setOriginalData(mockData);
      setCurrentData(mockData);
      generateQRCode(mockData);
    }
  };

  // Reset to original content
  const handleReset = () => {
    setCurrentData(originalData);
    generateQRCode(originalData);
  };

  useEffect(() => {
    const onPageLoad = () => loadInitialData();

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
      
      <p style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>
        {isExtensionMode ? 'Content to encode:' : 'Sample content:'}
      </p>
      
      {/* Editable content input */}
      <div style={{ marginBottom: '15px' }}>
        <textarea
          value={currentData}
          onChange={handleDataChange}
          placeholder="Enter any text, URL, or data to generate QR code"
          rows={3}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '8px',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={handleReset}
            disabled={currentData === originalData}
            style={{
              padding: '6px 12px',
              backgroundColor: currentData === originalData ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentData === originalData ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleRefresh}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4267b2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isExtensionMode ? 'Get Page URL' : 'New Sample'}
          </button>
        </div>
      </div>
      
      <div id="qrcode_container" style={{ marginBottom: '15px' }} />
      
      {currentData && currentData !== originalData && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          ✏️ Custom content - Click "Reset" to restore original
        </div>
      )}
    </div>
  );
}

export default App;
