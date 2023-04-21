// pages/index.js
import Head from "next/head";
import BluetoothConnection from "../components/BluetoothConnection";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js Web Bluetooth</title>
      </Head>

      <main>
        <h1>Next.js Web Bluetooth Example - Nick</h1>
        <BluetoothConnection />
      </main>
    </div>
  );
}
