import QRious from 'qrious';

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
      <div className="container" style={{marginTop:'10px', marginBottom:'10px'}}>
      <div className="row">
          <div className="span8">
            <p className="h1">QR Code:</p>
          </div>
          <div className="span4 d-none">
            <button className="btn btn-primary" type="button">Preferences</button>
          </div>
      </div>
      <div className="row">
          <div className="span12">
            <canvas id="qrcode_container"></canvas>
          </div>
        </div>
        <div className="row">
          <div className="span12">
            <p className="h3">
              Encoded Text:
            </p>
            <textarea id="qrcode_textArea" style={{width: '100%'}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
