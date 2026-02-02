import { retrieveContext } from "./retrieve.js";

function extractDisease(context) {
  if (!context) return "Possible Medical Condition";

  // Preferred pattern from your dataset
  const match = context.match(/Disease:\s*([^.\n]+)/i);
  if (match) return match[1].trim();

  // Pathology/technical report specific logic
  if (context.toLowerCase().includes("autopsy")) return "Autopsy / Post-mortem Examination";
  if (context.toLowerCase().includes("microbiological")) return "Microbiological Examination";
  if (context.toLowerCase().includes("pathology")) return "Pathology Finding";

  // Fallback keyword checks
  const text = context.toLowerCase();
  if (text.includes("angina")) return "Angina Pectoris";
  if (text.includes("myocardial")) return "Myocardial Infarction";
  if (text.includes("heart attack")) return "Heart Attack";
  if (text.includes("migraine")) return "Migraine";
  if (text.includes("gastritis")) return "Gastritis";

  return "Possible Medical Condition";
}

function cleanExplanation(context) {
  if (!context) return "";

  return context
    .replace(/Disease:\s*[^.]+\.?/gi, "")
    .replace(/Symptoms:\s*/gi, "")
    .replace(/Source:\s*[^.\n]+\n?/gi, "") // Remove source info from explanation
    .replace(/\s+/g, " ")
    .trim();
}


export async function answerQuestion(symptoms) {
  const context = retrieveContext(symptoms);

  if (!context) {
    return {
      summary: "🦠 Possible Condition: **No clear medical condition identified**\n\n⚠️ This is not a medical diagnosis.",
      specialist: "General Physician",
      urgency: "routine",
    };
  }

  const disease = extractDisease(context);
  const explanation = cleanExplanation(context);

  return {
    summary: `🦠 Possible Condition: **${disease}**

Explanation:
${explanation}

⚠️ This is not a medical diagnosis.`,
    specialist: guessSpecialist(symptoms),
    urgency: classifyUrgency(symptoms),
  };
}


function guessSpecialist(symptoms) {
  const s = symptoms.toLowerCase();

  if (s.includes("chest")) return "Cardiologist";
  if (s.includes("headache")) return "Neurologist";
  if (s.includes("skin")) return "Dermatologist";
  if (s.includes("stomach")) return "Gastroenterologist";

  return "General Physician";
}

function classifyUrgency(symptoms) {
  const s = symptoms.toLowerCase();

  if (s.includes("chest pain") || s.includes("breath")) return "emergency";
  if (s.includes("fever") || s.includes("pain")) return "urgent";

  return "routine";
}
