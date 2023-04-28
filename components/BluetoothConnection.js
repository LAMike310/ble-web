// useState, useEffect
import React, { useState, useEffect } from "react";
import axios from "axios";

const BluetoothConnection = () => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);
  // dataSent
  const [dataSent, setDataSent] = useState(false);

  const requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["2db70961-e9a8-4dd1-a0fd-69a1d852fe43"],
      });
      setDevice(device);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  async function getBitcoinPriceLambda() {
    const response = await axios.get(
      "https://xtnv62kss0.execute-api.us-west-1.amazonaws.com/"
    );
    return response.data;
  }

  const getRandomNumbers = async (num) => {
    // generate an array of 4 digit random numbers, num times
    let arrayOfNumbers = [];
    for (let i = 0; i < num; i++) {
      arrayOfNumbers.push(Math.floor(Math.random() * 10000));
    }
    return arrayOfNumbers;
  };

  // const sendDataInChunks = async (characteristic, data) => {
  //   const chunkSize = 20; // Adjust this value based on your device's supported MTU size
  //   for (let i = 0; i < data.length; i += chunkSize) {
  //     const chunk = data.slice(i, i + chunkSize);
  //     await characteristic.writeValue(chunk);
  //   }
  // };

  const sendDataToDevice = async ({ sendInChunks = false }) => {
    setDataSent(false);
    if (!device) {
      setError("No device connected");
      requestDevice();
      return;
    }
    let server;
    try {
      server = await device.gatt.connect();
      const service = await server.getPrimaryService(
        "2db70961-e9a8-4dd1-a0fd-69a1d852fe43"
      );
      const characteristic = await service.getCharacteristic(
        "ec2de08d-833f-4c9d-832e-ee0d0748d2cf"
      );
      const arrayOfPrices = await getBitcoinPriceLambda();
      const stringOfBitcoinPrices = arrayOfPrices.join(",");
      console.log(stringOfBitcoinPrices);
      const data = new TextEncoder().encode(stringOfBitcoinPrices);
      await characteristic.writeValue(data);
      console.log("Data sent");
      setDataSent(true);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (dataSent == true) {
      console.log("Data sent");
    }
  }, [dataSent]);

  return (
    <div>
      <button onClick={requestDevice}>Connect to device</button>
      <button onClick={sendDataToDevice}>Send data</button>
      {error && <p>Error: {error}</p>}
      {device && <p>Connected to {device.name}</p>}
    </div>
  );
};

export default BluetoothConnection;
