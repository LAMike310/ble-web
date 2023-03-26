// useState, useEffect
import React, { useState, useEffect } from "react";
const BluetoothConnection = () => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  const requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["fbba4179-b71a-4db7-8b48-6ff849aba480"],
      });
      setDevice(device);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendDataToDevice = async () => {
    if (!device) {
      setError("No device connected");
      requestDevice();
      return;
    }
    let server;
    try {
      // stop writing value to device
      // Connect to GATT server
      server = await device.gatt.connect();
      // stop all GATT operations

      const service = await server.getPrimaryService(
        "fbba4179-b71a-4db7-8b48-6ff849aba480"
      );
      const characteristic = await service.getCharacteristic(
        "4f36693f-b7a4-4e29-981f-cb00bb0d38d9"
      );

      // random 4 digit number
      const createRandomNumber = () =>
        Math.floor(1000 + Math.random() * 9000)
          .toString()
          .substring(0, 4);
      // create 10 random numbers
      const arrayOfRandomNumbers = Array.from({ length: 5 }, () =>
        createRandomNumber()
      );
      // convert array to string
      const stringOfRandomNumbers = arrayOfRandomNumbers.join(",");
      console.log(stringOfRandomNumbers);
      // Disconnect after 10 seconds
      setTimeout(async () => {
        sendDataToDevice();
      }, 5000);
      const data = new TextEncoder().encode(stringOfRandomNumbers);
      await characteristic.writeValue(data);
      console.log("Data sent");
    } catch (err) {
      setError(err.message);
    }
  };
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     sendDataToDevice();
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, [device]);

  return (
    <div>
      <button onClick={requestDevice}>Connect to device</button>
      {/* send data button */}
      <button onClick={sendDataToDevice}>Send data</button>
      {error && <p>Error: {error}</p>}
      {device && <p>Connected to {device.name}</p>}
    </div>
  );
};

export default BluetoothConnection;
