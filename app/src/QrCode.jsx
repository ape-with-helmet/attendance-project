import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = () => {
    const [scanned_text,TextScanner] = useState('')
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 60, qrbox: 1000 }
    );

    scanner.render(
      (decodedText) => {
        console.log(`Decoded Text: ${decodedText}`);
        TextScanner(decodedText);
      },
      (error) => {
        console.error(`QR Scanning Error: ${error}`);
      }
    );

    return () => scanner.clear();
  }, []);

  return (
    <>
        <div id="reader" style={{ width: "25%" }} />
        <span>{scanned_text}</span>
    </>
    );
};

export default QRCodeScanner;
