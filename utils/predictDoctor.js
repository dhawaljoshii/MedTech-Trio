// utils/predictDoctor.js

export function predictDoctorType(text) {
  console.log("🔍 predictDoctorType input:", text);

  if (!text || typeof text !== "string") {
    console.log("⚠️ Invalid input, falling back to GP");
    return "general-physician";
  }

  const t = text.toLowerCase();

  if (t.includes("heart") || t.includes("chest pain") || t.includes("cardiac")) {
    return "cardiologist";
  }

  if (t.includes("lung") || t.includes("breathing") || t.includes("cough")) {
    return "pulmonologist";
  }

  if (t.includes("skin") || t.includes("rash")) {
    return "dermatologist";
  }

  if (t.includes("pregnan") || t.includes("bleeding")) {
    return "gynecologist";
  }

  // 🔥 ABSOLUTE FALLBACK
  return "general-physician";
}
