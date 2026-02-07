"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import InsuranceDropdown from "@/components/InsuranceDropdown";

// Icons
const ArrowLeftIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ClockIcon = () => (
  <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const InboxIcon = () => (
  <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="icon-md animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const LockIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const REGISTER_TEXT = {
  en: {
    title: "Available Specialists",
    subtitle: "Select a time slot to book your appointment",
    back: "Back",
    loading: "Loading doctors...",
    noDoctors: "No doctors available for this specialty",
    symptoms: "Your symptoms",
    note: "You'll need to register before booking an appointment.",
    slots: "Available Slots",
    book: "Book Appointment",
    loginRequired: "Registration Required",
    loginMsg: "Please login or register to book an appointment.",
    cancel: "Cancel",
    register: "Register / Login",
    success: "Appointment booked successfully",
  },

  hi: {
    title: "उपलब्ध विशेषज्ञ डॉक्टर",
    subtitle: "अपॉइंटमेंट बुक करने के लिए समय चुनें",
    back: "वापस",
    loading: "डॉक्टर लोड हो रहे हैं...",
    noDoctors: "इस विशेषज्ञता के लिए कोई डॉक्टर उपलब्ध नहीं है",
    symptoms: "आपके लक्षण",
    note: "अपॉइंटमेंट बुक करने के लिए रजिस्ट्रेशन आवश्यक है।",
    slots: "उपलब्ध समय",
    book: "अपॉइंटमेंट बुक करें",
    loginRequired: "रजिस्ट्रेशन आवश्यक",
    loginMsg: "अपॉइंटमेंट बुक करने के लिए लॉगिन या रजिस्टर करें।",
    cancel: "रद्द करें",
    register: "रजिस्टर / लॉगिन",
    success: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया",
  },

  mr: {
    title: "उपलब्ध तज्ञ डॉक्टर",
    subtitle: "अपॉइंटमेंट बुक करण्यासाठी वेळ निवडा",
    back: "मागे",
    loading: "डॉक्टर लोड होत आहेत...",
    noDoctors: "या तज्ञतेसाठी डॉक्टर उपलब्ध नाहीत",
    symptoms: "तुमची लक्षणे",
    note: "अपॉइंटमेंटसाठी नोंदणी आवश्यक आहे.",
    slots: "उपलब्ध वेळ",
    book: "अपॉइंटमेंट बुक करा",
    loginRequired: "नोंदणी आवश्यक",
    loginMsg: "अपॉइंटमेंटसाठी लॉगिन किंवा नोंदणी करा.",
    cancel: "रद्द करा",
    register: "नोंदणी / लॉगिन",
    success: "अपॉइंटमेंट यशस्वीरीत्या बुक झाली",
  },

  ta: {
    title: "கிடைக்கும் நிபுணர் மருத்துவர்கள்",
    subtitle: "நியமனத்தை பதிவு செய்ய நேரத்தைத் தேர்ந்தெடுக்கவும்",
    back: "பின்செல்",
    loading: "மருத்துவர்கள் ஏற்றப்படுகிறது...",
    noDoctors: "இந்த நிபுணத்துவத்திற்கு மருத்துவர்கள் இல்லை",
    symptoms: "உங்கள் அறிகுறிகள்",
    note: "நியமனம் பதிவு செய்ய பதிவு அவசியம்.",
    slots: "கிடைக்கும் நேரங்கள்",
    book: "நியமனம் பதிவு செய்யவும்",
    loginRequired: "பதிவு அவசியம்",
    loginMsg: "நியமனம் பதிவு செய்ய உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    cancel: "ரத்து",
    register: "பதிவு / உள்நுழை",
    success: "நியமனம் வெற்றிகரமாக பதிவு செய்யப்பட்டது",
  },

  te: {
    title: "లభ్యమైన నిపుణుల డాక్టర్లు",
    subtitle: "అపాయింట్‌మెంట్ బుక్ చేయడానికి సమయాన్ని ఎంచుకోండి",
    back: "వెనుకకు",
    loading: "డాక్టర్లు లోడ్ అవుతున్నారు...",
    noDoctors: "ఈ నిపుణతకు డాక్టర్లు అందుబాటులో లేరు",
    symptoms: "మీ లక్షణాలు",
    note: "అపాయింట్‌మెంట్ కోసం నమోదు అవసరం.",
    slots: "అందుబాటులో ఉన్న సమయాలు",
    book: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    loginRequired: "నమోదు అవసరం",
    loginMsg: "అపాయింట్‌మెంట్ కోసం లాగిన్ లేదా నమోదు చేయండి.",
    cancel: "రద్దు",
    register: "నమోదు / లాగిన్",
    success: "అపాయింట్‌మెంట్ విజయవంతంగా బుక్ అయింది",
  },
};




function RegisterContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [bookingSlot, setBookingSlot] = useState(null);
  const [isVaccination, setIsVaccination] = useState(false);


  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [patient, setPatient] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const t = REGISTER_TEXT[language] || REGISTER_TEXT.en;
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const rawType = params.get("type");


  const safeType = isVaccination
    ? "pediatrician"
    : rawType || "general-physician";

  useEffect(() => {
    const vaccineFlag =
      rawType === "pediatric" ||
      rawType === "vaccination" ||
      (typeof window !== "undefined" &&
        localStorage.getItem("vaccineType") === "pediatric");

    setIsVaccination(vaccineFlag);
  }, [rawType]);



  //urgent booking algorithm (for emergencies)
  const urgencyData =
    isVaccination
      ? { level: "routine", score: 20, matchedKeywords: [], recommendation: "Standard vaccination", allowOnlineBooking: true }
      : typeof window !== "undefined" && localStorage.getItem("urgencyData")
        ? JSON.parse(localStorage.getItem("urgencyData"))
        : { level: "routine", score: 20, matchedKeywords: [], recommendation: "Standard consultation", allowOnlineBooking: true };

  const urgency = urgencyData.level; // Backward compatibility

  // 💰 Consultation fee (mock)
  const CONSULTATION_FEE_MAP = {
    "general-physician": 500,
    cardiologist: 1500,
    dermatologist: 800,
  };


  const vaccinesDue =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("vaccinesDue") || "[]")
      : [];


  const consultationFee = CONSULTATION_FEE_MAP[safeType] || 500;

  // 🧮 Billing & payment states
  const [insuranceCoverage, setInsuranceCoverage] = useState(0);
  const [netPayable, setNetPayable] = useState(0);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // 💳 UPI payment
  const [upiId, setUpiId] = useState("");

  // 🧾 Insurance states
  const [showInsurance, setShowInsurance] = useState(false);
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [insuranceResult, setInsuranceResult] = useState(null);
  const [checkingInsurance, setCheckingInsurance] = useState(false);

  //for vaccination
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [vaccinationSlot, setVaccinationSlot] = useState("");

  // 🚨 Emergency modal dismiss state
  const [dismissEmergencyModal, setDismissEmergencyModal] = useState(false);



  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLanguage(storedLang);
    }

    // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`/api/doctors?type=${safeType}`);
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };


    if (safeType) {
      fetchDoctors();
    } else {
      setIsLoading(false);
    }

  }, [safeType]);


  // ✅ Load patient from localStorage on first render
  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, []);

  // 🔁 Sync patient after returning from registration
  useEffect(() => {
    const syncPatient = () => {
      const storedPatient = localStorage.getItem("patient");
      if (storedPatient) {
        setPatient(JSON.parse(storedPatient));
        setShowLoginPrompt(false); // close modal if open
      }
    };

    window.addEventListener("focus", syncPatient);

    return () => {
      window.removeEventListener("focus", syncPatient);
    };
  }, []);

  // ▶️ Resume booking after successful login
  useEffect(() => {
    if (!patient) return;

    const pending = localStorage.getItem("pendingBooking");
    if (!pending) return;

    const { doctor, slot } = JSON.parse(pending);

    localStorage.removeItem("pendingBooking");

    bookAppointment(doctor, slot);
  }, [patient]);


  const handleSlotSelect = async (doctor, slot) => {
    if (isVaccination && !selectedHospital) {
      alert("Please select a hospital for vaccination.");
      return;
    }

    if (isVaccination) {
      if (!selectedHospital || !vaccinationDate || !vaccinationSlot) {
        alert("Please select hospital, vaccination date, and time slot.");
        return;
      }
    }

    setSelectedBooking({ doctor, slot });

    // 🚨 EMERGENCY BYPASS: Skip insurance for emergency/urgent cases to save time
    const isEmergencyOrUrgent = urgency === "emergency" || urgency === "urgent" ||
      (urgencyData.score >= 70); // Cardiac emergencies

    if (isEmergencyOrUrgent) {
      // Skip insurance modal, proceed directly to booking with zero payment
      setInsuranceCoverage(0);
      setShowInsurance(false);

      // Directly book the appointment
      await finalizeBooking(doctor, slot, 0); // 0 = no payment for emergencies
    } else {
      // Normal flow: show insurance modal for routine cases
      setShowInsurance(true);
    }
  };


  const verifyInsurance = async () => {
    if (!provider || !policyNumber) return;

    setCheckingInsurance(true);

    try {
      const res = await fetch("/api/insurance/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          policyNumber,
          doctorType: safeType,
        }),
      });

      const data = await res.json();
      setInsuranceResult(data);
    } catch (err) {
      setInsuranceResult({ eligible: false, reason: "Verification failed" });
    } finally {
      setCheckingInsurance(false);
    }
  };


  // 🚨 Emergency Fast-Track Booking (bypasses insurance & payment)
  const finalizeBooking = async (doctor, slot, insuranceCoverage) => {
    if (!selectedBooking) return;

    setBookingSlot(slot);
    setInsuranceCoverage(insuranceCoverage);

    // Directly book without payment for emergencies
    await bookAppointment(doctor, slot);
  };

  const confirmBookingAfterInsurance = async () => {
    if (!insuranceResult?.eligible || !selectedBooking) return;

    setShowInsurance(false);
    setInsuranceResult(null);
    setProvider("");
    setPolicyNumber("");

    setBookingSlot(selectedBooking.slot);
    await bookAppointment(selectedBooking.doctor, selectedBooking.slot);
  };

  const bookWithoutInsurance = async () => {
    setShowInsurance(false);
    setInsuranceResult(null);
    setProvider("");
    setPolicyNumber("");

    if (!selectedBooking) return;

    setBookingSlot(selectedBooking.slot);
    await bookAppointment(selectedBooking.doctor, selectedBooking.slot);
  };

  const processUpiPayment = async () => {

    const upiRegex = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{2,}$/;

    if (netPayable > 0) {
      const upiRegex = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{2,}$/;

      if (!upiRegex.test(upiId)) {
        alert("Incorrect UPI ID. Example: name@paytm");
        return;
      }
    }

    setPaymentLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId: netPayable > 0 ? upiId : "INSURANCE_FULL_COVER",
          amount: netPayable,
        }),
      });


      const data = await res.json();
      if (!data.success) throw new Error("UPI payment failed");

      // ✅ Payment success → book appointment
      setShowPayment(false);
      setPaymentLoading(false);
      setBookingSlot(selectedBooking.slot);
      await bookAppointment(
        selectedBooking.doctor,
        selectedBooking.slot
      );
    } catch (err) {
      alert("Payment failed. Please try again.");
      setPaymentLoading(false);
    }
  };

  const bookAppointment = async (doctor, slot) => {
    setIsBooking(true);

    const symptoms = localStorage.getItem("currentSymptoms") || "";

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient?.id || null,
          patientName: patient?.name || "Anonymous",
          doctorType: safeType,
          doctorName: doctor,
          slot: isVaccination
            ? `${vaccinationDate} | ${vaccinationSlot}`
            : slot,
          symptoms,
          urgency,
          appointmentType: isVaccination ? "vaccination" : "consultation",
          vaccines: isVaccination ? vaccinesDue : [],
          hospitalId: selectedHospital || null,
        })

      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      // Clear temporary data
      localStorage.removeItem("currentSymptoms");
      localStorage.removeItem("currentDoctorType");

      // Show Success Modal
      setShowSuccessModal(true);

      // ✅ clear vaccination temp data AFTER booking
      if (isVaccination) {
        localStorage.removeItem("vaccineType");
        localStorage.removeItem("vaccinesDue");
        localStorage.removeItem("childDOB");
      }

    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book appointment. Please try again.");
      setIsBooking(false);
      setBookingSlot(null);
    }
  };


  const handleRegisterRedirect = () => {
    // Store booking info to resume after registration
    if (selectedBooking) {
      localStorage.setItem("pendingBooking", JSON.stringify({
        doctor: selectedBooking.doctor,
        slot: selectedBooking.slot,
        type: safeType
      }));
    }
    router.push("/patient/register?redirect=booking");
  };

  if (isLoading) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <div className="empty-state">
              <LoaderIcon />
              <p>Loading doctors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const VACCINATION_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];


  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-card">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>{t.title}</h1>
              <p className="text-sm text-muted">{t.subtitle}</p>
            </div>
            <button onClick={() => router.push("/")} className="btn btn-secondary">
              <ArrowLeftIcon />
              {t.back}
            </button>
          </div>

          {/* 🚦 Enhanced Urgency Display */}
          {urgency !== "routine" && (
            <div className={`alert ${urgency === "emergency" ? "alert-danger" : "alert-warning"}`}
              style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ fontSize: "24px" }}>
                  {urgency === "emergency" ? "🚨" : "⚠️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {urgency === "emergency" ? "EMERGENCY - DO NOT BOOK ONLINE" : "URGENT CASE"}
                  </div>
                  <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                    {urgencyData.recommendation}
                  </div>

                  {/* Cardiac-specific emergency guidance */}
                  {urgencyData.score >= 70 && urgencyData.score < 95 && urgencyData.matchedKeywords?.some(k =>
                    k.includes("chest") || k.includes("heart") || k.includes("cardiac")
                  ) && (
                      <div style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "rgba(220, 38, 38, 0.1)",
                        borderRadius: "6px",
                        fontSize: "13px"
                      }}>
                        <div style={{ fontWeight: "600", marginBottom: "8px", color: "#dc2626" }}>
                          ⚠️ CARDIAC EMERGENCY - Immediate Actions:
                        </div>
                        <div style={{ lineHeight: "1.8" }}>
                          1. 📞 <strong>Call ambulance: 108</strong><br />
                          2. 💊 Chew aspirin if available (unless allergic)<br />
                          3. 🪑 Sit down, stay calm<br />
                          4. 🚫 <strong>Do NOT drive yourself</strong>
                        </div>
                        <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.9 }}>
                          While waiting, you may book priority slots below for follow-up care.
                        </div>
                      </div>
                    )}

                  {urgencyData.matchedKeywords?.length > 0 && (
                    <div style={{ fontSize: "13px", opacity: 0.9 }}>
                      <strong>Detected symptoms:</strong> {urgencyData.matchedKeywords.slice(0, 3).join(", ")}
                    </div>
                  )}
                  {urgencyData.score && (
                    <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.8 }}>
                      Urgency Score: {urgencyData.score}/100
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🚨 Emergency Blocking Modal */}
          {urgency === "emergency" && !urgencyData.allowOnlineBooking && !dismissEmergencyModal && (
            <div className="modal-overlay" style={{ zIndex: 9999 }}>
              <div className="modal-card" style={{ maxWidth: "500px", textAlign: "center" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🚨</div>
                <h2 style={{ color: "#dc2626", marginBottom: "12px" }}>MEDICAL EMERGENCY</h2>
                <p style={{ fontSize: "16px", marginBottom: "24px", lineHeight: "1.6" }}>
                  Based on your symptoms, this appears to be a medical emergency.
                  <strong> Do not wait for an online appointment.</strong>
                </p>

                <div className="alert alert-danger" style={{ marginBottom: "24px", textAlign: "left" }}>
                  <strong>Your symptoms:</strong>
                  <div style={{ marginTop: "8px" }}>
                    {urgencyData.symptoms || localStorage.getItem("currentSymptoms") || "Severe symptoms detected"}
                  </div>
                  {urgencyData.matchedKeywords?.length > 0 && (
                    <div style={{ marginTop: "8px", fontSize: "13px", opacity: 0.9 }}>
                      <strong>Detected keywords:</strong> {urgencyData.matchedKeywords.slice(0, 5).join(", ")}
                    </div>
                  )}
                </div>

                <div style={{ background: "#fef2f2", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#991b1b" }}>Immediate Actions:</h3>
                  <div style={{ display: "grid", gap: "12px", textAlign: "left" }}>
                    <a href="tel:108" className="btn btn-danger" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", padding: "12px" }}>
                      📞 Call Ambulance (108)
                    </a>
                    <a href="tel:102" className="btn btn-danger" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", padding: "12px" }}>
                      📞 Medical Emergency (102)
                    </a>
                  </div>
                </div>

                <div style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                  <strong>Or visit the nearest emergency department immediately</strong>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  <button
                    onClick={() => {
                      // Dismiss modal to allow viewing doctors
                      setDismissEmergencyModal(true);
                      // Scroll to doctors section
                      setTimeout(() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }, 100);
                    }}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    📋 View Available Doctors (Priority Slots)
                  </button>

                  <button
                    onClick={() => router.push("/")}
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                  >
                    Go Back to Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🏥 Hospital Selection */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label>Select Hospital</label>
            <select
              className="form-input"
              value={selectedHospital || ""}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">Choose a hospital</option>
              <option value="hosp_1">City Care Hospital</option>
              <option value="hosp_2">GreenLife Medical Center</option>
            </select>
          </div>

          {isVaccination && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Vaccination Date</label>
              <input
                type="date"
                className="form-input"
                value={vaccinationDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setVaccinationDate(e.target.value)}
              />
            </div>
          )}

          {isVaccination && vaccinationDate && (
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Select Time Slot</label>
              <div className="slots-grid">
                {VACCINATION_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    className={`slot-btn ${vaccinationSlot === slot ? "active" : ""
                      }`}
                    onClick={() => setVaccinationSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}




          {/* Login Required Modal */}
          {showLoginPrompt && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-icon">
                  <LockIcon />
                </div>
                <h3>Registration Required</h3>
                <p className="text-muted">Please register or login to book an appointment with {selectedBooking?.doctor} at {selectedBooking?.slot}</p>
                <div className="modal-actions">
                  <button onClick={() => setShowLoginPrompt(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleRegisterRedirect} className="btn btn-primary">
                    Register / Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Symptoms Summary */}
          {localStorage.getItem("currentSymptoms") && (
            <div className="alert alert-info" style={{ marginBottom: '20px' }}>
              <strong>{t.symptoms}:</strong> {localStorage.getItem("currentSymptoms")}
            </div>
          )}

          {isVaccination && vaccinesDue.length > 0 && (
            <div className="alert alert-success" style={{ marginBottom: "20px" }}>
              <strong>💉 Vaccines Due:</strong>
              <ul style={{ marginTop: "6px" }}>
                {vaccinesDue.map((v, i) => (
                  <li key={i}>{v.name}</li>
                ))}
              </ul>
            </div>
          )}


          {/* Patient Status */}
          {!patient && !showLoginPrompt && (
            <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
              <strong>Note:</strong> {t.note}
            </div>
          )}
          {/* 🧾 Insurance Check Modal */}
          {showInsurance && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Insurance Eligibility Check</h3>


                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>
                    Insurance Provider
                  </label>
                  <InsuranceDropdown
                    onSelect={setProvider}
                    selectedProvider={provider}
                  />
                </div>


                <input
                  className="form-input"
                  placeholder="Policy Number"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                />

                <button
                  className="btn btn-primary"
                  onClick={verifyInsurance}
                  disabled={checkingInsurance}
                >
                  {checkingInsurance ? "Checking..." : "Check Insurance"}
                </button>

                {insuranceResult && (
                  <div style={{ marginTop: "10px" }}>
                    {insuranceResult.eligible ? (
                      <>
                        <p>✅ Insurance Eligible</p>
                        <p>Coverage: ₹{insuranceResult.coverageAmount}</p>
                        <p>Copay: ₹{insuranceResult.copay}</p>

                        <button
                          className="btn btn-success"
                          onClick={() => {
                            const coverage = insuranceResult.coverageAmount || 0;
                            const net = Math.max(0, consultationFee - coverage);

                            setInsuranceCoverage(coverage);
                            setNetPayable(net);

                            setShowInsurance(false);
                            setShowPayment(true);
                          }}
                        >
                          Proceed to Payment
                        </button>

                      </>
                    ) : (
                      <p>❌ {insuranceResult.reason}</p>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-warning"
                  onClick={() => {
                    setInsuranceCoverage(0);
                    setNetPayable(consultationFee);

                    setShowInsurance(false);
                    setShowPayment(true);
                  }}
                  style={{ marginTop: "10px", width: "100%" }}
                >
                  I don't have insurance
                </button>


              </div>
            </div>
          )}

          {/* 💳 UPI Payment Modal */}
          {showPayment && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h3>Payment Summary</h3>

                <p>Consultation Fee: ₹{consultationFee}</p>
                <p>Insurance Coverage: -₹{insuranceCoverage}</p>
                <hr />
                <p><strong>Net Payable: ₹{netPayable}</strong></p>

                {netPayable > 0 ? (
                  <>
                    <input
                      className="form-input"
                      placeholder="Enter UPI ID (e.g. name@paytm)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={processUpiPayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? "Processing..." : `Pay ₹${netPayable}`}
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={processUpiPayment}
                  >
                    Confirm Appointment (No Payment Required)
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPayment(false)}
                  style={{ marginTop: "10px" }}
                  disabled={paymentLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}



          {/* ✅ Success Modal */}
          {showSuccessModal && (
            <div className="modal-overlay">
              <div className="modal-card" style={{ textAlign: "center", padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "#ecfdf5", color: "#10b981",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Appointment Confirmed!</h3>
                <p className="text-muted" style={{ marginBottom: "24px" }}>
                  Your appointment with <strong>{selectedBooking?.doctor || "Doctor"}</strong> at <strong>{bookingSlot}</strong> has been successfully booked.
                </p>

                <div className="alert alert-info" style={{ marginBottom: "24px", textAlign: "left", fontSize: "14px" }}>
                  📧 <strong>Email Sent:</strong> A confirmation email has been sent to your registered email address with all the details.
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => router.push("/patient/history")}
                  style={{ width: "100%" }}
                >
                  Go to Appointments
                </button>
              </div>
            </div>
          )}

          {/* Doctor List */}
          {doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <InboxIcon />
              </div>
              <p>{t.noDoctors}</p>
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors
                .filter(doc => !selectedHospital || doc.hospitalId === selectedHospital)
                .map((doc, i) => (
                  <div key={i} className="doctor-card">
                    <div className="doctor-header">
                      <div className="doctor-avatar">
                        {doc.name.charAt(0)}
                      </div>
                      <div className="doctor-info">
                        <h3>{doc.name}</h3>
                        <p>{safeType} Specialist</p>
                      </div>
                    </div>

                    <div className="slots-section">
                      <div className="slots-label flex items-center gap-2">
                        <ClockIcon />
                        {t.slots}
                      </div>
                      <div className="slots-grid">
                        {Array.isArray(doc.slots) && doc.slots.map((slot, idx) => {
                          // Highlight first 2 slots for urgent cases OR cardiac emergencies (score 70-94)
                          const isCardiacEmergency = urgencyData.score >= 70 && urgencyData.score < 95;
                          const isUrgentPriority = (urgency === "urgent" || isCardiacEmergency) && idx < 2;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSlotSelect(doc.name, slot)}
                              className={`slot-btn ${isUrgentPriority ? 'urgent-priority' : ''}`}
                              disabled={isBooking}
                              style={isUrgentPriority ? {
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                color: 'white',
                                fontWeight: '600',
                                border: '2px solid #f59e0b',
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                position: 'relative'
                              } : {}}
                            >
                              {isBooking && bookingSlot === slot ? (
                                <LoaderIcon />
                              ) : (
                                <>
                                  {slot}
                                  {isUrgentPriority && (
                                    <span style={{
                                      fontSize: '10px',
                                      display: 'block',
                                      marginTop: '2px',
                                      opacity: 0.9
                                    }}>
                                      ⚡ Priority
                                    </span>
                                  )}
                                </>
                              )}

                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <div className="empty-state">
              <LoaderIcon />
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}