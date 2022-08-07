<script>
import QRious from '../../../node_modules/qrious/dist/qrious'

window.addEventListener("load", function () {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
        if(tab && tab[0]) {
            console.log(tab[0].url);

            var qr = new QRious({
                element: document.getElementById('qrcode_container'),
                value: tab[0].url,
                size: 300
            });
        }
    });
});
</script>

<main>
  <div style="margin-bottom: 10px; font-size: 24px;">
    Encoded Page Url:
  </div>
  <canvas id="qrcode_container"></canvas>
</main>