import QRious from 'qrious';

import { useEffect, useState } from "react";

function App() {
  var qr;

  // This will run one time after the component mounts
  useEffect(() => {
    console.log('Point Here');
    qr = new QRious({element: document.getElementById('qrcode_container'), size: 250});

    const onPageLoad = () => {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
          if(tab && tab[0]) {
              console.log('Point 1:' + tab[0].url);
              setTimeout(() => {qr.value = tab[0].url;} , 0);

              setText(tab[0].url);
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

  const [text, setText] = useState('');

  const handleChange = (event) => {
    // console.log('Point 2:' + event.target.value);

    setText(event.target.value);
    setTimeout(() => {qr.value = event.target.value;} , 0);
  }

  const handleClickRefreshButton = (event) => {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
      if(tab && tab[0]) {
        setTimeout(() => {qr.value = tab[0].url;} , 0);
        setText(tab[0].url);
      }
    });
  }

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
            <textarea
              id="qrcode_textArea"
              style={{width: '100%'}}
              onChange={handleChange}
              value={text} />
          </div>
        </div>
        <div className="row">
          <div className="span12">
            <button className="btn btn-primary btn-sm float-end" type="button" onClick={handleClickRefreshButton}>Reset to Page Url</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
