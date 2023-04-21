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
        optionalServices: ["5fc7e946-3b94-4855-958f-668ec0074fb0"],
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

  const sendDataToDevice = async () => {
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
        "5fc7e946-3b94-4855-958f-668ec0074fb0"
      );
      const characteristic = await service.getCharacteristic(
        "79e122ae-e43f-44b2-bd0b-5e51d1ebc0a6"
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
      console.log("Sending another request to Lamda");
      sendDataToDevice();
    }
  }, [dataSent]);

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
