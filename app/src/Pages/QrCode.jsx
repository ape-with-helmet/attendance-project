import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import '../StyleSheets/main.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const QRCodeScanner = () => {
  const [scannedText, setScannedText] = useState('');
  const scannerRef = useRef(null); // Ref to store scanner instance
  const isScannerInitialized = useRef(false); // Track if scanner is initialized
  let isScanning = true;
  const sendToBackend = async (message) => {
    if (!isScanning) return;
    isScanning = false
    try {
      const response = await axios.post(
        "https://attendance-project-eibp.onrender.com/qr/mark-attendance", 
        { data: message },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success(response.data.message); // Show success toast
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setTimeout(() => {
        isScanning = true; // Re-enable scanning after 5 seconds
      }, 5000);
    }
  };

  useEffect(() => {
    // Initialize the scanner only once
    if (!isScannerInitialized.current) {
      console.log("ENTERED: Initializing scanner");

      const scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 1, qrbox: { width: 500, height: 500 } }
      );

      // Store scanner instance in ref
      scannerRef.current = scanner;

      // Setup the scanner render callback
      scanner.render(
        (decodedText) => {
          console.log(`Decoded Text: ${decodedText}`);
          setScannedText(decodedText); // Display the scanned data
          sendToBackend(decodedText); // Send to backend
        },
        (qrError) => {
          console.error(`QR Scanning Error: ${qrError}`);
        }
      );

      // Mark scanner as initialized
      isScannerInitialized.current = true;
    }

    return () => {
      // Cleanup scanner when component unmounts (only once)
      if (scannerRef.current) {
        console.log("RETURNING: Cleaning up scanner");
        scannerRef.current.clear().catch((error) => {
          console.error('Error clearing scanner:', error);
        });
        scannerRef.current = null; // Reset the ref after cleanup
        isScannerInitialized.current = false; // Reset initialization flag
        console.log("EXITED: Scanner cleaned up");
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div className="qrreader_main_sector">
        <div id="reader" style={{ width: '100%' }} />
      </div>
    </>
  );
};

export default QRCodeScanner;
