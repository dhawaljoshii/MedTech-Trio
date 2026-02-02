// app/api/doctors/route.js
import { DOCTOR_DIRECTORY } from "../../../utils/doctorDirectory";

const DEFAULT_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:00 PM",
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const rawDoctors =
    DOCTOR_DIRECTORY[type] || DOCTOR_DIRECTORY["general-physician"];

  // ✅ Ensure every doctor has slots
  const doctors = rawDoctors.map((doc) => ({
    ...doc,
    slots: Array.isArray(doc.slots) ? doc.slots : DEFAULT_SLOTS,
  }));

  return new Response(
    JSON.stringify({ doctors }),
    { headers: { "Content-Type": "application/json" } }
  );
}
