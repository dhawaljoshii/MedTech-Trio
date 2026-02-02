"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MonitorPage() {
  const router = useRouter();

  const [disease, setDisease] = useState(null);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [risk, setRisk] = useState("stable");
  const [patient, setPatient] = useState(null);

  // 🔹 Load patient + disease context
  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (!storedPatient) {
      router.push("/");
      return;
    }

    const patientData = JSON.parse(storedPatient);
    setPatient(patientData);

    const data = localStorage.getItem("activeChronicDisease");
    if (!data) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(data);
    setDisease(parsed.disease);

    const storedMetrics =
      JSON.parse(localStorage.getItem("healthMetrics")) || [];

    setEntries(
      storedMetrics.filter(
        (e) =>
          e.disease === parsed.disease &&
          e.patientName === patientData.name
      )
    );
  }, [router]);

  const evaluateRisk = (disease, value) => {
    if (disease === "diabetes") {
      if (value > 180) return "high";
      if (value > 140) return "moderate";
      return "stable";
    }

    if (disease === "hypertension") {
      const [sys] = value.split("/");
      if (sys > 160) return "high";
      if (sys > 130) return "moderate";
      return "stable";
    }

    if (disease === "asthma") {
      if (value.toLowerCase().includes("frequent"))
        return "moderate";
      return "stable";
    }

    return "stable";
  };

  // 🔹 SAVE ENTRY (THIS IS THE IMPORTANT PART)
 const saveEntry = () => {
  if (!patient || !patient.id || !patient.name || !input) return;

  const entry = {
    patientId: patient.id,        // 🔑 REQUIRED
    patientName: patient.name,    // 🔑 REQUIRED
    disease,
    value: input,
    recordedAt: new Date().toISOString(),
  };

  const all =
    JSON.parse(localStorage.getItem("healthMetrics")) || [];

  localStorage.setItem(
    "healthMetrics",
    JSON.stringify([...all, entry])
  );

  setEntries((prev) => [...prev, entry]);
  setRisk(evaluateRisk(disease, input));
  setInput("");
};


  if (!disease) return null;

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <div className="card">
        <div className="card-body">
          <h1>Chronic Disease Monitor</h1>

          <p>
            Monitoring: <strong>{disease.toUpperCase()}</strong>
          </p>

          <div
            className={`alert alert-${
              risk === "high"
                ? "danger"
                : risk === "moderate"
                ? "warning"
                : "success"
            }`}
          >
            Current Status: {risk.toUpperCase()}
          </div>

          {/* INPUT */}
          <div className="form-group">
            <label className="form-label">
              {disease === "diabetes" &&
                "Blood Glucose (mg/dL)"}
              {disease === "hypertension" &&
                "Blood Pressure (120/80)"}
              {disease === "asthma" &&
                "Symptoms / Inhaler Usage"}
            </label>

            <input
              className="form-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={saveEntry}
          >
            Save Entry
          </button>

          {/* HISTORY */}
          <h3 style={{ marginTop: "32px" }}>
            Recent Entries
          </h3>

          {entries
            .slice(-5)
            .reverse()
            .map((e, i) => (
              <div
                key={i}
                className="card"
                style={{ marginTop: "8px" }}
              >
                <div className="card-body">
                  {e.value} ·{" "}
                  {new Date(
                    e.recordedAt
                  ).toLocaleDateString()}
                </div>
              </div>
            ))}

          <button
            className="btn btn-secondary"
            style={{ marginTop: "24px" }}
            onClick={() => router.push("/")}
          >
            Back to Chatbot
          </button>
        </div>
      </div>
    </div>
  );
}
