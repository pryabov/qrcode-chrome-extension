import QRCodeStyling from 'qr-code-styling';
import { useEffect } from "react";

function App() {
  // This will run one time after the component mounts
  useEffect(() => {
    const onPageLoad = () => {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
          if(tab && tab[0]) {
              const qrCode = new QRCodeStyling({
                  width: 300,
                  height: 300,
                  data: tab[0].url,
                  dotsOptions: {
                      color: "#4267b2",
                      type: "rounded"
                  },
                  backgroundOptions: {
                      color: "#e9ebee",
                  }
              });
              
              // Clear previous QR code if any
              const container = document.getElementById('qrcode_container');
              container.innerHTML = '';
              
              // Append the QR code to the container
              qrCode.append(container);
          }
      });
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <div className="App">
        <div style={{marginBottom:'10px', fontSize: '24px'}}>
          Encoded Page Url:
        </div>
        <div id="qrcode_container"></div>
    </div>
  )
}

export default App
