import { NextResponse } from "next/server";

export async function POST(req) {
  const { provider, policyNumber, doctorType } = await req.json();

  if (!provider || !policyNumber) {
    return NextResponse.json(
      { eligible: false, reason: "Missing insurance details" },
      { status: 400 }
    );
  }

  // Mock coverage logic
  const coverageMap = {
    "general-physician": 500,
    cardiologist: 1500,
    dermatologist: 800,
  };

  return NextResponse.json({
    eligible: true,
    coverageAmount: coverageMap[doctorType] || 500,
    copay: 200,
  });
}
