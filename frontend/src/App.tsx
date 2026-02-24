import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebase";

export default function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [led, setLed] = useState<boolean>(false);

  const basePath = "devices/env_node_1";

  useEffect(() => {
    const tempRef = ref(db, `${basePath}/temperature`);
    const humRef = ref(db, `${basePath}/humidity`);
    const ledRef = ref(db, `${basePath}/control/led`);

    onValue(tempRef, (snap) => {
      if (snap.exists()) setTemperature(snap.val());
    });

    onValue(humRef, (snap) => {
      if (snap.exists()) setHumidity(snap.val());
    });

    onValue(ledRef, (snap) => {
      if (snap.exists()) setLed(snap.val());
    });
  }, []);

  /* ---------- Toggle LED ---------- */
  const toggleLed = () => {
    const ledRef = ref(db, `${basePath}/control/led`);
    set(ledRef, !led);
  };

  return (
    <div className="dashboard">
      <h1>🌍 IoT Environment Monitor</h1>

      {/* Temperature */}
      <div className="card">
        <div className="temp">🌡 Temperature: {temperature} °C</div>
      </div>

      {/* Humidity */}
      <div className="card">
        <div className="temp">💧 Humidity: {humidity} %</div>
      </div>

      {/* LED Control */}
      <div className="card">
        <h3>LED Control</h3>

        <button
          onClick={toggleLed}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            background: led ? "#ef4444" : "#22c55e",
            color: "white"
          }}
        >
          {led ? "Turn OFF LED" : "Turn ON LED"}
        </button>
      </div>
    </div>
  );
}