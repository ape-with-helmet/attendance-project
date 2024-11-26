import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const QRCodeScanner = () => {
  const [scannedText, setScannedText] = useState('');
  const [error, setError] = useState('');
  const [data,setData] = useState({
    admission_no: '',
    branch: '',
    s_name: '',
    section: '',
    usn: ''
  })

  const sendToBackend = async (message) => {
    try {
      const response = await axios.post("http://localhost:5000/mark-attendance", { data: message });
      console.log('Backend Response:', response.data);
      setData(response.data.data[0][0])
      console.log(data)

    } catch (err) {
      console.error('Error sending data to the backend:', err);
      setError('err');
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 60, qrbox: 1000 }
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
      <div id="reader" style={{ width: '50%' }} />
      {
      scannedText && <p>
          Marked Attendance for: <br/>
          Admission No : {data.admission_no} <br/>
          Name : {data.s_name} <br/>
          USN : {data.usn} <br/>
          Branch : {data.branch} <br/>
          Section : {data.section} <br/>
        </p>
      }
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
};

export default QRCodeScanner;
