"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChronicMonitorDashboard() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
  const loadChronicData = async () => {
    const doctor = JSON.parse(localStorage.getItem("doctor"));
    if (!doctor) return;

    // 🔎 Normalize helper
    const normalize = (s) => String(s || "").trim().toLowerCase();

    // 1️⃣ Fetch appointments (try doctor.type first)
    let res = await fetch(
      `/api/appointments?doctor=${encodeURIComponent(doctor.type || doctor.name)}`
    );
    let appointments = await res.json();

    // 🔁 Fallback if empty
    if (!appointments.length) {
      res = await fetch(
        `/api/appointments?doctor=${encodeURIComponent(doctor.name)}`
      );
      appointments = await res.json();
    }

    console.log("Appointments fetched:", appointments);

    // 2️⃣ Build patient set
    const patientSet = new Set(
      appointments.map((a) => normalize(a.patientName))
    );

    console.log("Patient set:", [...patientSet]);

    // 3️⃣ Load chronic metrics
    const metrics =
      JSON.parse(localStorage.getItem("healthMetrics")) || [];

    console.log("All health metrics:", metrics);

    // 4️⃣ Filter metrics for patients under this doctor
    const relevantMetrics = metrics.filter((m) =>
      patientSet.has(normalize(m.patientName))
    );

    console.log("Filtered metrics:", relevantMetrics);

    // 5️⃣ Group by patient + disease
    const grouped = {};
    relevantMetrics.forEach((m) => {
      if (!m.patientName || !m.disease) return;

      const key = `${normalize(m.patientName)}-${m.disease}`;

      if (!grouped[key]) {
        grouped[key] = {
          patientName: m.patientName,
          disease: m.disease,
          records: [],
        };
      }

      grouped[key].records.push(m);
    });

    setPatients(Object.values(grouped));
  };

  loadChronicData();
}, []);


  const evaluateRisk = (disease, value) => {
    if (!value) return "🟢 Stable";

    if (disease === "diabetes") {
      const v = Number(value);
      if (v > 180) return "🔴 High";
      if (v > 140) return "🟡 Moderate";
      return "🟢 Stable";
    }

    if (disease === "hypertension") {
      const [sys] = String(value).split("/");
      const s = Number(sys);
      if (s > 160) return "🔴 High";
      if (s > 130) return "🟡 Moderate";
      return "🟢 Stable";
    }

    if (disease === "asthma") {
      return String(value).toLowerCase().includes("frequent")
        ? "🟡 Moderate"
        : "🟢 Stable";
    }

    return "🟢 Stable";
  };

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <h1>Chronic Monitoring</h1>
      <p className="text-muted">Patients under your care</p>

      {/* PATIENT LIST */}
      <div className="card" style={{ marginTop: "24px" }}>
        <div className="card-body">
          <h3>Patients</h3>

          {patients.length === 0 && (
            <div className="alert alert-info">
              No chronic monitoring data yet.
            </div>
          )}

          {patients.map((p, i) => (
            <div
              key={i}
              className="card"
              style={{ marginTop: "12px", cursor: "pointer" }}
              onClick={() => setSelected(p)}
            >
              <div className="card-body">
                <strong>{p.patientName}</strong> —{" "}
                {p.disease.toUpperCase()}
                <div className="text-muted">
                  Records: {p.records.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SELECTED PATIENT */}
      {selected && (
        <div className="card" style={{ marginTop: "32px" }}>
          <div className="card-body">
            <h2>
              {selected.patientName} —{" "}
              {selected.disease.toUpperCase()}
            </h2>

            <h4 style={{ marginTop: "16px" }}>Recent Readings</h4>

            {selected.records
              .slice(-5)
              .reverse()
              .map((r, i) => (
                <div key={i} className="card" style={{ marginTop: "8px" }}>
                  <div className="card-body">
                    <strong>{r.value}</strong> ·{" "}
                    {new Date(r.recordedAt).toLocaleDateString()}
                    <div>
                      Status: {evaluateRisk(selected.disease, r.value)}
                    </div>
                  </div>
                </div>
              ))}

            <div className="alert alert-info" style={{ marginTop: "16px" }}>
              🤖 AI Insight: Review trends and consider follow-up if
              deterioration persists.
            </div>

            <div style={{ marginTop: "16px" }}>
              <button className="btn btn-primary btn-sm">
                Schedule Appointment
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: "8px" }}
              >
                Add Clinical Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
