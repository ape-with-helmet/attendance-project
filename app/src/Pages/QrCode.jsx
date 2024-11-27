import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import '../StyleSheets/main.css'

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
      { fps: 1, qrbox: 1000 }
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
        <div className="qr_info">
          {
          scannedText && <>
              <div className="qr_dataline">
                <div className="holder">Admission No : </div>
                <div className="qrdata">{data.admission_no}</div>
              </div>
              <div className="qr_dataline">
                <div className="holder">Name : </div>
                <div className="qrdata">{data.s_name}</div>
              </div>
              <div className="qr_dataline">
                <div className="holder">USN : </div>
                <div className="qrdata">{data.usn}</div>
              </div>
              <div className="qr_dataline">
                <div className="holder">Branch : </div>
                <div className="qrdata">{data.branch}</div>
              </div>
              <div className="qr_dataline">
                <div className="holder">Section : </div>
                <div className="qrdata">{data.section}</div>
              </div>
              </>
          }
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  );
};

export default QRCodeScanner;
