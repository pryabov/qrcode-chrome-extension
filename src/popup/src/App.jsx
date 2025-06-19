import QRCodeStyling from 'qr-code-styling';
import { useEffect, useState } from "react";

// Mock data for development mode
const MOCK_DATA = [
  'https://github.com/vitejs/vite',
  'https://react.dev/',
  'Contact: john.doe@example.com\nPhone: +1-234-567-8900',
  'WiFi:T:WPA;S:MyNetwork;P:password123;H:false;'
];

// Default QR code configuration
const DEFAULT_QR_CONFIG = {
  width: 300,
  height: 300,
  dotsOptions: {
    color: "#4267b2",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#e9ebee",
  },
  cornersSquareOptions: {
    type: "square",
    color: "#4267b2"
  },
  cornersDotOptions: {
    type: "square",
    color: "#4267b2"
  }
};

function App() {
  const [originalData, setOriginalData] = useState(''); // Original content from page/mock
  const [currentData, setCurrentData] = useState(''); // Current content (editable)
  const [isExtensionMode, setIsExtensionMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [qrCodeInstance, setQrCodeInstance] = useState(null); // Store QR code instance for download
  
  // QR customization options
  const [qrConfig, setQrConfig] = useState(DEFAULT_QR_CONFIG);

  // Generate QR code with current configuration
  const generateQRCode = (data) => {
    if (!data) return;
    
    const qrCode = new QRCodeStyling({
      ...qrConfig,
      data: data
    });
    
    const container = document.getElementById('qrcode_container');
    if (container) {
      container.innerHTML = '';
      qrCode.append(container);
      setQrCodeInstance(qrCode); // Store instance for download
    }
  };

  // Handle QR config changes
  const updateQrConfig = (updates) => {
    const newConfig = { ...qrConfig, ...updates };
    setQrConfig(newConfig);
    if (currentData) {
      const qrCode = new QRCodeStyling({
        ...newConfig,
        data: currentData
      });
      const container = document.getElementById('qrcode_container');
      if (container) {
        container.innerHTML = '';
        qrCode.append(container);
        setQrCodeInstance(qrCode); // Store instance for download
      }
    }
  };

  // Download QR code
  const downloadQRCode = (format = 'png') => {
    if (!qrCodeInstance) return;
    
    const fileName = `qrcode-${Date.now()}`;
    qrCodeInstance.download({
      name: fileName,
      extension: format
    });
  };

  // Reset QR settings to default
  const resetQrSettings = () => {
    setQrConfig(DEFAULT_QR_CONFIG);
    if (currentData) {
      generateQRCode(currentData);
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
  const handleReset = () => {
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
    <div className="App" style={{ padding: '10px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '5px', fontSize: '20px', fontWeight: 'bold', marginTop: '0' }}>
        QR Code Generator
      </h1>
      
      {!isExtensionMode && (
        <div style={{ 
          marginBottom: '10px', 
          padding: '8px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          🛠️ Development Mode - Using mock data
        </div>
      )}
      
      <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
        {isExtensionMode ? 'Content to encode:' : 'Sample content:'}
      </p>
      
      {/* Editable content input */}
      <div style={{ marginBottom: '10px' }}>
        <textarea
          value={currentData}
          onChange={handleDataChange}
          placeholder="Enter any text, URL, or data to generate QR code"
          rows={3}
          style={{
            width: '100%',
            maxWidth: '300px',
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '6px',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
        />
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <button
            onClick={handleReset}
            disabled={currentData === originalData}
            style={{
              padding: '6px 12px',
              backgroundColor: currentData === originalData ? '#ccc' : '#4267b2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentData === originalData ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            {isExtensionMode ? 'Get Page URL' : 'New Sample'}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 12px',
              backgroundColor: showSettings ? '#28a745' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showSettings ? 'Hide Settings' : 'Customize'}
          </button>
        </div>
      </div>

      {/* QR Customization Settings */}
      {showSettings && (
        <div style={{
          marginBottom: '10px',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          fontSize: '11px',
          maxWidth: '300px',
          margin: '0 auto 10px auto'
        }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '13px', textAlign: 'center' }}>🎨 Customize</h3>
          
          {/* Colors Row */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '10px' }}>
                Dots:
              </label>
              <input
                type="color"
                value={qrConfig.dotsOptions.color}
                onChange={(e) => updateQrConfig({
                  dotsOptions: { ...qrConfig.dotsOptions, color: e.target.value },
                  cornersSquareOptions: { ...qrConfig.cornersSquareOptions, color: e.target.value },
                  cornersDotOptions: { ...qrConfig.cornersDotOptions, color: e.target.value }
                })}
                style={{ width: '100%', height: '22px', cursor: 'pointer', border: 'none', borderRadius: '2px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '10px' }}>
                Background:
              </label>
              <input
                type="color"
                value={qrConfig.backgroundOptions.color}
                onChange={(e) => updateQrConfig({
                  backgroundOptions: { ...qrConfig.backgroundOptions, color: e.target.value }
                })}
                style={{ width: '100%', height: '22px', cursor: 'pointer', border: 'none', borderRadius: '2px' }}
              />
            </div>
          </div>

          {/* Styles Row */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '10px' }}>
                Dot Style:
              </label>
              <select
                value={qrConfig.dotsOptions.type}
                onChange={(e) => updateQrConfig({
                  dotsOptions: { ...qrConfig.dotsOptions, type: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '2px',
                  border: '1px solid #ddd',
                  borderRadius: '2px',
                  fontSize: '10px'
                }}
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy+</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '10px' }}>
                Corners:
              </label>
              <select
                value={qrConfig.cornersSquareOptions.type}
                onChange={(e) => updateQrConfig({
                  cornersSquareOptions: { ...qrConfig.cornersSquareOptions, type: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '2px',
                  border: '1px solid #ddd',
                  borderRadius: '2px',
                  fontSize: '10px'
                }}
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Rounded</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetQrSettings}
            style={{
              width: '100%',
              padding: '4px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Reset
          </button>
        </div>
      )}
      
      <div id="qrcode_container" style={{ marginBottom: '10px' }} />
      
      {/* Download Options */}
      {currentData && qrCodeInstance && (
        <div style={{
          marginBottom: '10px',
          display: 'flex',
          gap: '6px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => downloadQRCode('png')}
            style={{
              padding: '4px 8px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold'
            }}
          >
            📥 PNG
          </button>
          <button
            onClick={() => downloadQRCode('svg')}
            style={{
              padding: '4px 8px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold'
            }}
          >
            📥 SVG
          </button>
          <button
            onClick={() => downloadQRCode('jpeg')}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ffc107',
              color: '#212529',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold'
            }}
          >
            📥 JPG
          </button>
        </div>
      )}
      
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
