import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import '../StyleSheets/main.css'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const QRCodeScanner = () => {
  const [scannedText, setScannedText] = useState('');

  const sendToBackend = async (message) => {
    try {
      const response = await axios.post("http://localhost:5000/qr/mark-attendance", 
      { data:message },
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 60, qrbox: { width: 1000, height: 1000 },}
    );

    scanner.render(
      (decodedText) => {
        console.log(`Decoded Text: ${decodedText}`);
        setScannedText(decodedText); // Display the scanned data
        sendToBackend(decodedText);
      },
      (qrError) => {
        console.error(`QR Scanning Error: ${qrError}`);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error('Error clearing scanner:', error);
      });
    };
  }, []);

  return (
    <>
      <div className="qrreader_main_sector">
        <div id="reader" style={{ width: '80%' }} />
      </div>
    </>
  );
};

export default QRCodeScanner;
