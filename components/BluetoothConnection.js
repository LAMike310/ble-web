// components/BluetoothConnection.js
import React, { useState } from "react";

const BluetoothConnection = () => {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState(null);

  const requestDevice = async () => {
    try {
      // acceptAllDevices
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
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
      return;
    }

    try {
      const server = await device.gatt.connect();
      if (!server) {
        setError("Failed to connect to GATT server");
        return;
      }

      const service = await server.getPrimaryService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
      );
      if (!service) {
        setError("Failed to get primary service");
        return;
      }

      const characteristic = await service.getCharacteristic(
        "beb5483e-36e1-4688-b7f5-ea07361b26a8"
      );
      if (!characteristic) {
        setError("Failed to get characteristic");
        return;
      }

      const data = new TextEncoder().encode("123");
      await characteristic.writeValue(data);
      console.log("Data sent");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={requestDevice}>Connect to device</button>
      <button onClick={sendDataToDevice}>Send Data</button>
      {error && <p>Error: {error}</p>}
      {device && <p>Connected to {device.name}</p>}
    </div>
  );
};

export default BluetoothConnection;
