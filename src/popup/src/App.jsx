import * as QRious from 'qrious';

import { useEffect } from "react";

function App() {
  // This will run one time after the component mounts
  useEffect(() => {
    const onPageLoad = () => {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
          if(tab && tab[0]) {
              var qr = new QRious({
                  element: document.getElementById('qrcode_container'),
                  value: tab[0].url,
                  size: 300
              });
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
        <canvas id="qrcode_container"></canvas>
    </div>
  )
}

export default App
