import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { upiId, amount } = await req.json();

    // ✅ Allow amount = 0 (insurance covers full bill)
    if (amount === undefined) {
      return NextResponse.json(
        { success: false, reason: "Amount missing" },
        { status: 400 }
      );
    }

    // ✅ Only require UPI ID if payment is needed
    if (amount > 0 && !upiId) {
      return NextResponse.json(
        { success: false, reason: "UPI ID missing" },
        { status: 400 }
      );
    }

    // 🧪 MOCK PAYMENT SUCCESS
    return NextResponse.json({
      success: true,
      transactionId: "TXN_" + Date.now(),
      gateway: "PAYTM",
      status: "SUCCESS",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, reason: "Server error" },
      { status: 500 }
    );
  }
}
