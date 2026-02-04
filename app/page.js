"use client";

import { useState, useEffect } from "react";
import ChatBubble from "@/components/ChatBubble";
import LanguageDropdown from "@/components/LanguageDropdown";
import { LANGUAGES } from "@/utils/languages";
import { hasFullSupport, getLanguageEnglishName } from "@/utils/languages_extended";
import { useRouter } from "next/navigation";
import { PHQ9, GAD7, SCORE_OPTIONS } from "@/utils/mentalHealth"
import { DOCTOR_DIRECTORY } from "@/utils/doctorDirectory";
import { VACCINATION_SCHEDULE } from "@/utils/vaccinationSchedule";


// Icons
const HeartPulseIcon = () => (
  <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </svg>
);

const SendIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const UserIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const FileUploadIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M12 18v-6" />
    <path d="M9 15l3-3 3 3" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const UserPlusIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

// Sidebar Icons
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MonitorIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LoginIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

//Language changer for symptoms message
const SYMPTOM_PROMPT = {
  en: "You selected ENGLISH: What symptoms are you facing today?",
  hi: "आपने हिन्दी भाषा का चयन किया है: आपको कौन से लक्षण महसूस हो रहे हैं?",
  mr: "तुम्ही मराठी निवडले: आपल्याला कोणती लक्षणे जाणवत आहेत?",
  ta: "நீங்கள் தமிழைத் தேர்ந்தெடுத்துள்ளீர்கள்: உங்களுக்கு என்ன அறிகுறிகள் உள்ளன?",
  te: "మీరు తెలుగును ఎంచుకున్నారు: మీకు ఎలాంటి లక్షణాలు ఉన్నాయి?",
};

//for chest pain triage (dertermining if your condition is emergency)
const CHEST_PAIN_QUESTIONS = {
  en: [
    "Are you experiencing shortness of breath?",
    "Do you have pain in your left arm, jaw, or back?",
    "Are you sweating heavily or feeling dizzy?",
    "Has the chest pain lasted more than 20 minutes?",
  ],

  hi: [
    "क्या आपको सांस लेने में तकलीफ हो रही है?",
    "क्या बाएं हाथ, जबड़े या पीठ में दर्द है?",
    "क्या आपको अधिक पसीना आ रहा है या चक्कर आ रहा है?",
    "क्या सीने का दर्द 20 मिनट से अधिक समय से है?",
  ],

  mr: [
    "तुम्हाला श्वास घेण्यास त्रास होत आहे का?",
    "डाव्या हातात, जबड्यात किंवा पाठीमध्ये वेदना आहेत का?",
    "खूप घाम येत आहे किंवा चक्कर येत आहे का?",
    "छातीतला त्रास 20 मिनिटांपेक्षा जास्त वेळ आहे का?",
  ],

  ta: [
    "உங்களுக்கு மூச்சுத்திணறல் இருக்கிறதா?",
    "இடது கை, தாடை அல்லது முதுகில் வலி உள்ளதா?",
    "அதிக வியர்வை அல்லது மயக்கம் உள்ளதா?",
    "மார்புவலி 20 நிமிடங்களுக்கும் மேலாக உள்ளதா?",
  ],

  te: [
    "మీకు శ్వాస తీసుకోవడంలో ఇబ్బంది ఉందా?",
    "ఎడమ చేయి, దవడ లేదా వెన్నునొప్పి ఉందా?",
    "అధికంగా చెమటలు పడుతున్నాయా లేదా తల తిరుగుతోందా?",
    "ఛాతీ నొప్పి 20 నిమిషాలకు పైగా కొనసాగుతోందా?",
  ],
};

// 🩺 Chronic disease keywords
const CHRONIC_KEYWORDS = {
  diabetes: ["diabetes", "high sugar", "blood sugar", "glucose"],
  hypertension: ["high bp", "blood pressure", "hypertension"],
  asthma: ["asthma", "wheezing", "breathing problem"],
};

// 📋 Simple care plans (v1)
const CHRONIC_CARE_PLANS = {
  diabetes: {
    title: "Diabetes Care Plan",
    goals: [
      "Maintain fasting glucose 80–130 mg/dL",
      "HbA1c below 7%",
    ],
    lifestyle: [
      "Low sugar & low refined carb diet",
      "30 minutes daily walking",
    ],
    monitoring: [
      "Daily blood sugar check",
      "HbA1c every 3 months",
    ],
    specialist: "endocrinologist",
  },

  hypertension: {
    title: "Hypertension Care Plan",
    goals: ["BP below 130/80 mmHg"],
    lifestyle: ["Low salt diet", "Regular exercise"],
    monitoring: ["BP twice a week"],
    specialist: "cardiologist",
  },

  asthma: {
    title: "Asthma Care Plan",
    goals: ["No night-time symptoms"],
    lifestyle: ["Avoid allergens", "Use inhaler correctly"],
    monitoring: ["Peak flow monitoring"],
    specialist: "pulmonologist",
  },
};

/**
 * Helper Functions for Message Management
 * These utilities simplify common message operations and reduce code duplication
 */

/**
 * Creates a bot message object
 * @param {string} text - Message text
 * @param {Object} options - Optional message options (options, useDropdown, typing)
 * @returns {Object} Message object
 */
const createBotMessage = (text, options = {}) => ({
  text,
  sender: "bot",
  ...options
});

/**
 * Creates a user message object
 * @param {string} text - Message text
 * @returns {Object} Message object
 */
const createUserMessage = (text) => ({
  text,
  sender: "user"
});

/**
 * Batch adds multiple messages to state
 * @param {Function} setMessages - State setter function
 * @param {Array} newMessages - Array of message objects to add
 */
const addMessages = (setMessages, newMessages) => {
  setMessages(prev => [...prev, ...newMessages]);
};

/**
 * Detects if text contains chronic condition keywords
 * @param {string} text - Text to analyze
 * @returns {string|null} Detected condition or null
 */
const detectChronicCondition = (text) => {
  const t = text.toLowerCase();
  for (const condition in CHRONIC_KEYWORDS) {
    if (CHRONIC_KEYWORDS[condition].some(k => t.includes(k))) {
      return condition;
    }
  }
  return null;
};

export default function Chatbot() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingDiagnosis, setPendingDiagnosis] = useState(null);

  //states for language selection
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState("symptoms");
  // language | symptoms | vaccination_dob


  //states for chest pain triage 
  const [chestPainTriage, setChestPainTriage] = useState(null);
  const [chestAnswers, setChestAnswers] = useState([]);
  const [triageSymptoms, setTriageSymptoms] = useState(null);

  const [mentalMode, setMentalMode] = useState(null); // "PHQ9" | "GAD7"
  const [mentalStep, setMentalStep] = useState(0);
  const [mentalAnswers, setMentalAnswers] = useState([]);

  const getDueVaccines = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const ageWeeks = Math.floor(
      (today - birthDate) / (1000 * 60 * 60 * 24 * 7)
    );

    return VACCINATION_SCHEDULE.filter(v => v.ageWeeks <= ageWeeks);
  };

  const [messages, setMessages] = useState([

    { text: `Hello! Welcome to HealthConnect.`, sender: "bot" },
    { text: "What symptoms are you facing today?", sender: "bot" }
  ]);

  const [input, setInput] = useState("");

  // Document upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sessionDocuments, setSessionDocuments] = useState([]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    // 🔥 Clear stale booking data on new chat session
    localStorage.removeItem("currentSymptoms");
    localStorage.removeItem("currentDoctorType");


    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      setPatient(patientData);

      setMessages([
        {
          text: `Hello ${patientData.name}! Welcome to HealthConnect.`,
          sender: "bot",
        },
        {
          text: "What symptoms are you facing today?",
          sender: "bot",
        },
      ]);
    } else {
      setMessages([
        {
          text: "Welcome to HealthConnect.",
          sender: "bot"
        },
        {
          text: "What symptoms are you facing today?",
          sender: "bot"
        },
      ]);
    }
  }, []);

  const detectLanguage = (text) => {
    const t = text.toLowerCase();
    if (t.includes("english")) return "en";
    if (t.includes("hindi")) return "hi";
    if (t.includes("marathi")) return "mr";
    if (t.includes("tamil")) return "ta";
    if (t.includes("telugu")) return "te";
    return null;
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);

    const langName = getLanguageEnglishName(lang);
    const fullSupport = hasFullSupport(lang);

    const feedbackMsg = fullSupport && SYMPTOM_PROMPT[lang]
      ? SYMPTOM_PROMPT[lang]
      : `You selected ${langName}. What symptoms are you facing today?`;

    setMessages(prev => [...prev, { text: feedbackMsg, sender: "bot" }]);
  };

  const classifyUrgency = (symptoms) => {
    const text = symptoms.toLowerCase();

    const emergencyKeywords = [
      "chest pain",
      "breathless",
      "shortness of breath",
      "unconscious",
      "faint",
      "severe bleeding",
      "heart pain",
    ];

    const urgentKeywords = [
      "severe pain",
      "high fever",
      "worsening",
      "persistent pain",
    ];

    if (emergencyKeywords.some(k => text.includes(k))) {
      return "emergency";
    }

    if (urgentKeywords.some(k => text.includes(k))) {
      return "urgent";
    }

    return "routine";
  };


  const saveChat = async (symptoms, doctorType) => {
    if (!patient) return; // ✅ do nothing if not logged in

    try {
      await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          patientName: patient.name,
          symptoms,
          doctorType,
          messages: messages.map(m => ({ text: m.text, sender: m.sender })),
          documents: sessionDocuments
        })
      });
    } catch (error) {
      console.error("Failed to save chat:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const startMentalHealthAssessment = (symptoms) => {
    const type = symptoms.toLowerCase().includes("anxiety") ? "GAD7" : "PHQ9";

    setMentalMode(type);
    setMentalStep(0);
    setMentalAnswers([]);

    setMessages(prev => [
      ...prev,
      {
        text: `🧠 I’d like to ask you a few questions to understand how you’ve been feeling.
This is a short ${type} screening. Answer honestly.`,
        sender: "bot",
      },
      {
        text: type === "GAD7" ? GAD7[0] : PHQ9[0],
        sender: "bot",
        options: SCORE_OPTIONS,
      },
    ]);
  };

  const finishMentalAssessment = (answers, type) => {
    const score = answers.reduce((a, b) => a + b, 0);

    let level = "minimal";
    if (type === "PHQ9") {
      if (score >= 20) level = "severe";
      else if (score >= 15) level = "moderately severe";
      else if (score >= 10) level = "moderate";
      else if (score >= 5) level = "mild";
    } else {
      if (score >= 15) level = "severe";
      else if (score >= 10) level = "moderate";
      else if (score >= 5) level = "mild";
    }

    // 🔁 OPTIONAL: Call RAG after mental screening
    fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symptoms: `Mental health screening: ${type}, score ${score}, level ${level}`,
        language,
      }),
    });


    setMessages(prev => [
      ...prev,
      {
        text: `🧠 ${type} Screening Result

Score: ${score}
Level: ${level}

⚠️ This is a screening result, not a diagnosis.`,
        sender: "bot",
      },
      {
        text: "Would you like to talk to a mental health professional?",
        sender: "bot",
        options: [
          { label: "Book Appointment", value: "mental_booking" },
        ],
      },
    ]);

    setPendingDiagnosis({
      source: "mental",
      doctorType: "psychiatrist",
      doctors: DOCTOR_DIRECTORY["psychiatrist"],
      symptoms: `Mental health screening: ${type} score ${score}`,
    });



    setMentalMode(null);
    setMentalStep(0);
    setMentalAnswers([]);
  };



  const handleOptionSelect = async (value) => {

    if (value === "chronic_tracking" && !patient) {
      setMessages(prev => [
        ...prev,
        {
          text: "Please login to monitor your condition.",
          sender: "bot",
          options: [
            { label: "Login / Register", value: "login_redirect" },
          ],
        },
      ]);
      return;
    }


    // 🧠 Mental health screening flow
    if (mentalMode && typeof value === "number") {
      const newAnswers = [...mentalAnswers, value];
      setMentalAnswers(newAnswers);

      const questions = mentalMode === "GAD7" ? GAD7 : PHQ9;
      const nextStep = mentalStep + 1;

      if (nextStep < questions.length) {
        setMentalStep(nextStep);
        setMessages(prev => [
          ...prev,
          {
            text: questions[nextStep],
            sender: "bot",
            options: SCORE_OPTIONS,
          },
        ]);
      } else {
        finishMentalAssessment(newAnswers, mentalMode);
      }
      return;
    }

    // 🩺 Chronic follow-up booking
    if (value === "chronic_booking" && pendingDiagnosis?.source === "chronic") {
      localStorage.setItem("urgency", "routine");
      localStorage.setItem("currentSymptoms", pendingDiagnosis.symptoms);

      router.push(`/register?type=${pendingDiagnosis.doctorType}`);
      return;
    }

    // 📊 Chronic tracking → Monitoring page
    if (value === "chronic_tracking") {
      router.push("/patient/monitor");
      return;
    }

    //for pedia booking
    if (value === "book_vaccine") {
      router.push("/register?type=pediatrician");
      return;
    }


    // 🫀 Handle chest pain triage answers
    if (value === "chest_yes" || value === "chest_no") {
      const answer = value === "chest_yes";
      const newAnswers = [...chestAnswers, answer];
      setChestAnswers(newAnswers);

      const nextStep = chestPainTriage.step + 1;

      // Ask next question
      if (nextStep < CHEST_PAIN_QUESTIONS[language || "en"].length) {
        setChestPainTriage({ step: nextStep });

        setMessages(prev => [
          ...prev,
          {
            text: CHEST_PAIN_QUESTIONS[language || "en"][nextStep],
            sender: "bot",
            options: [
              { label: "Yes", value: "chest_yes" },
              { label: "No", value: "chest_no" },
            ],
          },
        ]);
      } else {
        const redFlagCount = newAnswers.filter(Boolean).length;
        const urgency =
          redFlagCount >= 1 ? "emergency" : "urgent";

        localStorage.setItem("urgency", urgency);

        // 🔁 CALL RAG AFTER TRIAGE
        setMessages(prev => [
          ...prev,
          {
            text:
              urgency === "emergency"
                ? "🚨 Based on your answers, this may be a medical emergency."
                : "⚠️ Chest pain detected. An urgent consultation is recommended.",
            sender: "bot",
          },
          {
            text: "Analyzing your symptoms further...",
            sender: "bot",
            typing: true,
          },
        ]);

        try {
          const res = await fetch("/api/diagnose", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symptoms: triageSymptoms,
              language,
            }),
          });

          const data = await res.json();

          setMessages(prev => [
            ...prev,
            {
              text:
                language === "hi"
                  ? `🦠 संभावित रोग / स्थिति:\n\n${data.summary}\n\n⚠️ यह अंतिम चिकित्सा निदान नहीं है।`
                  : language === "mr"
                    ? `🦠 संभाव्य आजार / स्थिती:\n\n${data.summary}\n\n⚠️ हा अंतिम वैद्यकीय निदान नाही.`
                    : language === "ta"
                      ? `🦠 சாத்தியமான நிலை:\n\n${data.summary}\n\n⚠️ இது இறுதி மருத்துவ முடிவு அல்ல.`
                      : language === "te"
                        ? `🦠 సంభావ్య పరిస్థితి:\n\n${data.summary}\n\n⚠️ ఇది తుది వైద్య నిర్ధారణ కాదు.`
                        : `🦠 Possible condition:\n\n${data.summary}\n\n⚠️ This is not a medical diagnosis.`,
              sender: "bot",
            },
            {
              text:
                language === "hi"
                  ? "क्या आप डॉक्टर से परामर्श के लिए अपॉइंटमेंट बुक करना चाहेंगे?"
                  : language === "mr"
                    ? "डॉक्टरकडे सल्ल्यासाठी अपॉइंटमेंट बुक करायची आहे का?"
                    : language === "ta"
                      ? "மருத்துவருடன் ஆலோசனைக்கு நேரம்செலுத்த வேண்டுமா?"
                      : language === "te"
                        ? "డాక్టర్‌ను సంప్రదించేందుకు అపాయింట్‌మెంట్ బుక్ చేయాలా?"
                        : "Would you like to book a consultation with a doctor?",
              sender: "bot",
              options: [
                {
                  label:
                    language === "hi"
                      ? "अपॉइंटमेंट बुक करें"
                      : language === "mr"
                        ? "अपॉइंटमेंट बुक करा"
                        : language === "ta"
                          ? "நியமனம் பதிவு செய்யவும்"
                          : language === "te"
                            ? "అపాయింట్‌మెంట్ బుక్ చేయండి"
                            : "Book Appointment",
                  value: "recommend_specialist",
                },
              ],
            },
          ]);

          setPendingDiagnosis({
            source: "chest",
            doctorType: data.doctorType,
            doctors: data.doctors,
            symptoms: triageSymptoms,
            diseaseInfo: data.summary, //for RAG optimization 
          });



        } catch (err) {
          setMessages(prev => [
            ...prev,
            { text: "❌ Unable to analyze symptoms. Please proceed to booking.", sender: "bot" },
          ]);
        }

        // reset triage
        setChestPainTriage(null);
        setChestAnswers([]);
        setTriageSymptoms(null);
      }


      return;
    }

    // 🔹 NEW: Specialist confirmation
    if (value === "recommend_specialist" && pendingDiagnosis) {
      const { doctorType, doctors, symptoms, source } = pendingDiagnosis;

      // 🔒 FINAL SAFETY OVERRIDE
      let finalSymptoms = symptoms;

      if (source === "mental") {
        finalSymptoms = symptoms; // mental screening text
      }

      if (source === "physical" || source === "document_analysis") {
        finalSymptoms = symptoms;
      }

      if (source === "chest" && !symptoms?.toLowerCase().includes("chest")) {
        // stale chest data — block it
        return;
      }

      const safeDoctorType = doctorType || "general-physician";
      const safeDoctors = Array.isArray(doctors) ? doctors : [];

      setMessages(prev => [
        ...prev,
        {
          text: `👨‍⚕️ Recommended specialist: ${safeDoctorType.replace("-", " ")}`,
          sender: "bot",
        },
        {
          text: safeDoctors.length
            ? `Available doctors:\n${safeDoctors
              .map(d => `• ${d.name} (${d.specialization})`)
              .join("\n")}`
            : "No doctors are available right now. You can still proceed with booking.",
          sender: "bot",
        },
      ]);

      await saveChat(finalSymptoms, safeDoctorType);

      localStorage.removeItem("currentSymptoms");
      localStorage.setItem("currentSymptoms", finalSymptoms);
      localStorage.removeItem("currentDoctorType");
      localStorage.setItem("currentDoctorType", safeDoctorType);


      if (patient) {
        // logged-in user → go to booking
        setTimeout(() => {
          router.push(`/register?type=${safeDoctorType}`);
        }, 2000);
      } else {
        // not logged in → show login message
        setMessages(prev => [
          ...prev,
          {
            text:
              language === "hi"
                ? "अपॉइंटमेंट बुक करने के लिए कृपया लॉगिन या रजिस्टर करें।"
                : language === "mr"
                  ? "अपॉइंटमेंट बुक करण्यासाठी कृपया लॉगिन किंवा नोंदणी करा."
                  : language === "ta"
                    ? "அப்பாயிண்ட்மெண்ட் பதிவு செய்ய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்."
                    : language === "te"
                      ? "అపాయింట్‌మెంట్ బుక్ చేయడానికి దయచేసి లాగిన్ లేదా నమోదు చేయండి."
                      : "Please login or register to book an appointment.",
            sender: "bot",
            options: [
              {
                label:
                  language === "hi"
                    ? "लॉगिन / रजिस्टर"
                    : language === "mr"
                      ? "लॉगिन / नोंदणी"
                      : language === "ta"
                        ? "உள்நுழை / பதிவு"
                        : language === "te"
                          ? "లాగిన్ / నమోదు"
                          : "Login / Register",
                value: "login_redirect",
              },
            ],
          },
        ]);
      }


      setPendingDiagnosis(null);
      return;
    }

    // 🔹 Language selection (existing logic)
    if (step === "language") {
      setLanguage(value);
      localStorage.setItem("lang", value);
      setStep("symptoms");

      const langName = getLanguageEnglishName(value);
      const fullSupport = hasFullSupport(value);

      // Show appropriate message based on language support
      const symptomPrompt = fullSupport && SYMPTOM_PROMPT[value]
        ? SYMPTOM_PROMPT[value]
        : `You selected ${langName}. What symptoms are you facing today?`;

      setMessages(prev => [
        ...prev,
        { text: symptomPrompt, sender: "bot" },
      ]);
      return;
    }


    if (value === "track_readings") {
      router.push('/patient/monitor');
      // Optionally provide a message
      setMessages(prev => [...prev, { text: "Opening your health monitor...", sender: "bot" }]);
      return;
    }

    if (value === "mental_booking") {
      router.push("/register?type=psychiatrist");
      return;
    }



    // 🔐 Login / Register redirect from chatbot
    if (value === "login_redirect") {
      router.push("/patient/register");
      return;
    }


  };

  const localizeDiseaseText = (text, lang) => {
    const safeText =
      typeof text === "string" && text.trim().length > 0
        ? text
        : lang === "hi"
          ? "लक्षणों के आधार पर स्पष्ट रोग निर्धारित नहीं किया जा सका।"
          : "Based on the symptoms, a clear condition could not be determined.";

    if (lang === "hi") {
      return `🦠 संभावित रोग / स्थिति:\n\n${safeText}\n\n⚠️ यह अंतिम चिकित्सा निदान नहीं है।`;
    }

    return `🦠 Possible condition:\n\n${safeText}\n\n⚠️ This is not a medical diagnosis.`;

    // 🔐 Redirect user to login / register page
    if (value === "login_redirect") {
      router.push("/patient/register");
      return;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or image file (JPG, PNG)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Add analysis to chat
        setMessages(prev => [
          ...prev,
          { text: `📄 Uploaded: ${selectedFile.name}`, sender: 'user' },
          { text: data.analysis, sender: 'bot' }
        ]);

        // Track document
        setSessionDocuments(prev => [...prev, {
          name: selectedFile.name,
          type: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
          url: '#' // Placeholder
        }]);

        if (data.specialist) {
          // Normalize specialist string for directory lookup (basic attempt)
          const specKey = data.specialist.toLowerCase().replace(/\s+/g, "-");
          const availableDoctors = DOCTOR_DIRECTORY[specKey] || [];

          setPendingDiagnosis({
            source: "document_analysis",
            doctorType: data.specialist,
            doctors: availableDoctors,
            symptoms: `Document Analysis: ${selectedFile.name}`
          });

          setMessages(prev => [
            ...prev,
            {
              text: `Based on the analysis, I recommend consulting a **${data.specialist}**. Would you like to check availability?`,
              sender: "bot",
              options: [
                { label: "Book Appointment", value: "recommend_specialist" }
              ]
            }
          ]);
        }

        // Close modal and reset
        setShowUploadModal(false);
        setSelectedFile(null);
      } else {
        alert(data.error || 'Failed to analyze document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSend = async () => {

    if (loading) return;

    // STEP 1: Language selection (UNCHANGED)

    if (step === "language") {
      const lang = detectLanguage(input);

      if (!lang) {
        setMessages([...messages, { text: LANGUAGES.en.invalid, sender: "bot" }]);
      } else {
        localStorage.setItem("lang", lang);
        setLanguage(lang);
        setStep("symptoms");

        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: LANGUAGES[lang].askSymptoms, sender: "bot" },
        ]);
      }

      setInput("");
      return;
    }


    // STEP 2: Symptoms → AI
    if (!input.trim() || loading) return;

    const userInput = input.trim();

    // 🚸 1️⃣ HANDLE DOB FIRST
    if (step === "vaccination_dob") {
      const dobRegex = /^\d{2}-\d{2}-\d{4}$/;

      if (!dobRegex.test(userInput)) {
        setMessages(prev => [
          ...prev,
          {
            text:
              language === "hi"
                ? "कृपया सही प्रारूप में तारीख डालें (DD-MM-YYYY)।"
                : "Please enter DOB in DD-MM-YYYY format.",
            sender: "bot",
          },
        ]);
        return;
      }

      localStorage.setItem("childDOB", userInput);

      const dueVaccines = getDueVaccines(userInput);
      localStorage.setItem("vaccinesDue", JSON.stringify(dueVaccines));

      setMessages(prev => [
        ...prev,
        { text: userInput, sender: "user" },
        {
          text:
            dueVaccines.length > 0
              ? `💉 Vaccines due:\n${dueVaccines
                .map(v => `• ${v.name}`)
                .join("\n")}`
              : "✅ No vaccines due yet.",
          sender: "bot",
        },
        {
          text: "Would you like to book a vaccination appointment?",
          sender: "bot",
          options: [
            { label: "Yes", value: "book_vaccine" },
            { label: "Later", value: "cancel_vaccine" },
          ],
        },
      ]);

      setStep("symptoms");
      setInput("");
      return;
    }

    const vaccinationKeywords = [
      "vaccination",
      "vaccine",
      "immunization",
      "baby vaccine",
      "child vaccination",
    ];

    if (vaccinationKeywords.some(k => input.toLowerCase().includes(k))) {
      setMessages(prev => [
        ...prev,
        {
          text:
            language === "hi"
              ? "कृपया बच्चे की जन्म तिथि बताएं (DD-MM-YYYY)।"
              : language === "mr"
                ? "कृपया बाळाची जन्मतारीख सांगा (DD-MM-YYYY)."
                : language === "ta"
                  ? "குழந்தையின் பிறந்த தேதியை கூறவும் (DD-MM-YYYY)."
                  : language === "te"
                    ? "దయచేసి పిల్లల పుట్టిన తేదీ చెప్పండి (DD-MM-YYYY)."
                    : "Please tell the child’s date of birth (DD-MM-YYYY).",
          sender: "bot",
        },
      ]);

      setStep("vaccination_dob");
      setInput("");
      return;
    }

    const userSymptoms = userInput;

    setMessages(prev => [
      ...prev,
      { text: userSymptoms, sender: "user" },
    ]);

    setInput(""); // ✅ safe here


    if (!userSymptoms.toLowerCase().includes("chest pain")) {
      setTriageSymptoms(null);
    }

    // 🩺 CHRONIC DISEASE FLOW (BEFORE RAG)
    // const chronicCondition = detectChronicCondition(userSymptoms); // DISABLED FOR RAG

    if (false) { // was if (chronicCondition)
      const plan = CHRONIC_CARE_PLANS[chronicCondition];

      setMessages(prev => [
        ...prev,
        {
          text: `🩺 It looks like you may be managing a chronic condition.

📌 Condition: ${chronicCondition.toUpperCase()}`,
          sender: "bot",
        },
        {
          text: `📋 ${plan.title}

🎯 Goals:
${plan.goals.map(g => `• ${g}`).join("\n")}

🥗 Lifestyle:
${plan.lifestyle.map(l => `• ${l}`).join("\n")}

📊 Monitoring:
${plan.monitoring.map(m => `• ${m}`).join("\n")}`,
          sender: "bot",
        },
        {
          text: "What would you like to do next?",
          sender: "bot",
          options: [
            { label: "Book follow-up", value: "chronic_booking" },
            { label: "Track readings", value: "chronic_tracking" },
          ],
        },
      ]);

      setPendingDiagnosis({
        source: "chronic",
        condition: chronicCondition,
        doctorType: plan.specialist,
        symptoms: userSymptoms,
      });

      // ✅ STORE chronic disease context for monitoring page
      localStorage.setItem(
        "activeChronicDisease",
        JSON.stringify({
          disease: chronicCondition, // diabetes | hypertension | asthma
          detectedAt: new Date().toISOString(),
          source: "chatbot",
        })
      );


      return; // ⛔ STOP normal RAG flow
    }



    const isMentalHealthQuery = (text) => {
      const t = text.toLowerCase();
      return [
        "anxiety",
        "depression",
        "stress",
        "panic",
        "sad",
        "hopeless",
        "sleep problem",
        "overthinking",
        "mental",
      ].some(k => t.includes(k));
    };

    if (isMentalHealthQuery(userSymptoms)) {
      startMentalHealthAssessment(userSymptoms);
      return;
    }

    // 🛑 Block RAG while mental assessment is active
    if (mentalMode) {
      return;
    }


    // 🫀 Chest pain triage trigger
    if (
      userSymptoms.toLowerCase().includes("chest pain") &&
      !chestPainTriage
    ) {

      setTriageSymptoms(userSymptoms); // ✅ SAVE SYMPTOMS
      setChestPainTriage({ step: 0 });

      setMessages(prev => [
        ...prev,
        {
          text: CHEST_PAIN_QUESTIONS[language || "en"][0],
          sender: "bot",
          options: [
            { label: "Yes", value: "chest_yes" },
            { label: "No", value: "chest_no" },
          ],
        },
      ]);


      setInput("");
      return; // ⛔ pause normal diagnosis
    }

    const urgency = classifyUrgency(userSymptoms);
    localStorage.setItem("urgency", urgency);
    setInput("");
    setLoading(true);

    // Show user message
    setMessages(prev => [
      ...prev,
      { text: "Analyzing your symptoms...", sender: "bot", typing: true },
    ]);


    if (step === "vaccination_dob") {
      const dobInput = input.trim();

      // Basic DOB validation
      const dobRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dobRegex.test(dobInput)) {
        setMessages(prev => [
          ...prev,
          {
            text:
              language === "hi"
                ? "कृपया सही प्रारूप में तारीख डालें (DD-MM-YYYY)।"
                : "Please enter DOB in DD-MM-YYYY format.",
            sender: "bot",
          },
        ]);
        return;
      }

      // Save DOB
      localStorage.setItem("childDOB", dobInput);

      // Calculate vaccines
      const dueVaccines = getDueVaccines(dobInput);

      localStorage.setItem("vaccineType", "pediatric");
      localStorage.setItem("vaccinesDue", JSON.stringify(dueVaccines));

      setMessages(prev => [
        ...prev,
        { text: dobInput, sender: "user" },
        {
          text:
            dueVaccines.length > 0
              ? `💉 Vaccines due:\n${dueVaccines
                .map(v => `• ${v.name}`)
                .join("\n")}`
              : "✅ No vaccines due yet.",
          sender: "bot",
        },
        {
          text: "Would you like to book a vaccination appointment?",
          sender: "bot",
          options: [
            { label: "Yes", value: "book_vaccine" },
            { label: "Later", value: "cancel_vaccine" },
          ],
        },
      ]);

      setStep("symptoms"); // reset flow
      setInput("");
      return;
    }


    try {
      // Call RAG + LLM backend
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: userSymptoms,
          language,
          patientContext: patient?.medicalHistory || null
        }),
      });

      const data = await res.json();
      console.log("🔍 DIAGNOSE API RESPONSE:", data); // Debugging Log

      // ✅ Auto-Save Detected Conditions & Prepare Message
      let extractedConditionMsg = null;
      if (data.detected_conditions && data.detected_conditions.length > 0 && patient) {
        const currentConditions = patient.medicalHistory?.chronicConditions || [];
        const newConditions = data.detected_conditions.filter(c =>
          !currentConditions.some(existing => existing.toLowerCase() === c.toLowerCase())
        );

        if (newConditions.length > 0) {
          const updatedConditions = [...currentConditions, ...newConditions];

          // 1. Update Local State
          setPatient(prev => ({
            ...prev,
            medicalHistory: {
              ...prev.medicalHistory,
              chronicConditions: updatedConditions
            }
          }));

          // 2. Persist to DB
          fetch('/api/patients', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: patient.id,
              medicalHistory: { chronicConditions: updatedConditions }
            })
          }).catch(err => console.error("Failed to auto-save condition", err));

          // 3. Prepare Notification
          extractedConditionMsg = {
            text: `📝 I've noted that you have **${newConditions.join(", ")}**. I've added this to your medical history for better future diagnosis.`,
            sender: "bot"
          };
        }
      }


      // ✅ Show disease explanation (localized later if needed)
      setMessages(prev => {
        const updated = [
          ...prev,
          {
            text:
              language === "hi"
                ? `🦠 संभावित रोग / स्थिति:\n\n${data.summary}\n\n⚠️ यह अंतिम चिकित्सा निदान नहीं है।`
                : language === "mr"
                  ? `🦠 संभाव्य आजार / स्थिती:\n\n${data.summary}\n\n⚠️ हा अंतिम वैद्यकीय निदान नाही.`
                  : language === "ta"
                    ? `🦠 சாத்தியமான நிலை:\n\n${data.summary}\n\n⚠️ இது இறுதி மருத்துவ முடிவு அல்ல.`
                    : language === "te"
                      ? `🦠 సంభావ్య పరిస్థితి:\n\n${data.summary}\n\n⚠️ ఇది తుది వైద్య నిర్ధారణ కాదు.`
                      : `🦠 Possible condition:\n\n${data.summary}\n\n⚠️ This is not a medical diagnosis.`,
            sender: "bot",
          },
        ];

        // 📝 Insert Condition Notification HERE (Before urgency/booking)
        if (extractedConditionMsg) {
          updated.push(extractedConditionMsg);
        }

        // 🚨 Emergency message AFTER disease
        if (urgency === "emergency") {
          updated.push({
            text:
              language === "hi"
                ? "🚨 यह एक आपातकालीन स्थिति हो सकती है। तत्काल डॉक्टर से परामर्श आवश्यक है।"
                : language === "mr"
                  ? "🚨 ही आपत्कालीन स्थिती असू शकते. त्वरित डॉक्टरांचा सल्ला घ्या."
                  : language === "ta"
                    ? "🚨 இது அவசர நிலையாக இருக்கலாம். உடனடி மருத்துவர் ஆலோசனை தேவை."
                    : language === "te"
                      ? "🚨 ఇది అత్యవసర పరిస్థితి కావచ్చు. వెంటనే వైద్య సలహా అవసరం."
                      : "🚨 This may be an emergency. Immediate medical consultation is recommended.",
            sender: "bot",
          });
        }

        // ⚠️ Urgent message
        if (urgency === "urgent") {
          updated.push({
            text:
              language === "hi"
                ? "⚠️ आपके लक्षणों के लिए जल्द अपॉइंटमेंट की सलाह दी जाती है।"
                : language === "mr"
                  ? "⚠️ लवकर अपॉइंटमेंट घेण्याचा सल्ला दिला जातो."
                  : language === "ta"
                    ? "⚠️ விரைவான நியமனம் பரிந்துரைக்கப்படுகிறது."
                    : language === "te"
                      ? "⚠️ త్వరిత అపాయింట్‌మెంట్ సిఫారసు చేయబడింది."
                      : "⚠️ An urgent consultation is recommended.",
            sender: "bot",
          });
        }

        // ✅ Determine if tracking option is relevant
        const trackingKeywords = ["diabetes", "sugar", "bp", "blood pressure", "hypertension", "asthma", "glucose"];
        const summaryText = data.summary?.toLowerCase() || "";
        const hasChronicContext = trackingKeywords.some(k => summaryText.includes(k)) ||
          (data.detected_conditions && data.detected_conditions.length > 0);

        const responseOptions = [
          {
            label:
              language === "hi"
                ? "अपॉइंटमेंट बुक करें"
                : language === "mr"
                  ? "अपॉइंटमेंट बुक करा"
                  : language === "ta"
                    ? "நியமனம் பதிவு செய்யவும்"
                    : language === "te"
                      ? "అపాయింట్‌మెంట్ బుక్ చేయండి"
                      : "Book Appointment",
            value: "recommend_specialist",
          }
        ];

        if (hasChronicContext) {
          responseOptions.push({
            label: "Track Readings",
            value: "track_readings",
          });
        }

        updated.push({
          text:
            language === "hi"
              ? "क्या आप डॉक्टर से परामर्श के लिए अपॉइंटमेंट बुक करना चाहेंगे?"
              : language === "mr"
                ? "डॉक्टरकडे सल्ल्यासाठी अपॉइंटमेंट बुक करायची आहे का?"
                : language === "ta"
                  ? "மருத்துவருடன் ஆலோசனைக்கு நேரம்செலுத்த வேண்டுமா?"
                  : language === "te"
                    ? "డాక్టర్‌ను సంప్రదించేందుకు అపాయింట్‌మెంట్ బుక్ చేయాలా?"
                    : "Would you like to book a consultation with a doctor?",
          sender: "bot",
          options: responseOptions,
        });

        return updated;
      });


      // ✅ Store diagnosis for later (booking step)
      setPendingDiagnosis({
        source: "physical",   // ✅ THIS IS THE NORMAL RAG FLOW
        doctorType: data.doctorType,
        doctors: data.doctors,
        symptoms: userSymptoms,
        diseaseInfo: data.summary,
      });


      // ✅ Auto-Save Detected Conditions (DISABLED - DUPLICATE)
      if (false) { // was: if (data.detected_conditions && data.detected_conditions.length > 0 && patient) {
        const currentConditions = patient.medicalHistory?.chronicConditions || [];
        const newConditions = data.detected_conditions.filter(c =>
          !currentConditions.some(existing => existing.toLowerCase() === c.toLowerCase())
        );

        if (newConditions.length > 0) {
          const updatedConditions = [...currentConditions, ...newConditions];

          // 1. Update Local State
          setPatient(prev => ({
            ...prev,
            medicalHistory: {
              ...prev.medicalHistory,
              chronicConditions: updatedConditions
            }
          }));

          // 2. Persist to DB
          fetch('/api/patients', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: patient.id,
              medicalHistory: { chronicConditions: updatedConditions }
            })
          }).catch(err => console.error("Failed to auto-save condition", err));

          // 3. Notify User (Optional, nice touch)
          setMessages(prev => [...prev, {
            text: `📝 I've noted that you have **${newConditions.join(", ")}**. I've added this to your medical history for better future diagnosis.`,
            sender: "bot"
          }]);
        }
      }


      // ✅ Save chat ONLY if logged in
      await saveChat(userSymptoms, data.doctorType);

      // ❌ DO NOT redirect here
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { text: "❌ Unable to analyze symptoms. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }

  };


  const handleLogout = () => {
    // Clear auth
    localStorage.removeItem("patient");

    // Optional: keep language OR reset it (your choice)
    // localStorage.removeItem("lang");

    // Reset states
    setPatient(null);
    setLanguage(null);
    setStep("language");
    setPendingDiagnosis(null);
    setInput("");
    setLoading(false);

    // Reset chat messages to initial state
    setMessages([
      { text: "Hello! Welcome to HealthConnect.", sender: "bot" },
      {
        text: "Select your language.",
        sender: "bot",
        useDropdown: true,
      },
    ]);
  };

  return (
    <div className="page-wrapper with-sidebar">
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Collapsible Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <HeartPulseIcon />
            </div>
            <span className="sidebar-brand-text">HealthConnect</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* User Section */}
        <div className="sidebar-user-section">
          {patient ? (
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar">
                {patient.name?.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{patient.name}</div>
                <div className="sidebar-user-status">Active</div>
              </div>
            </div>
          ) : (
            <div className="sidebar-guest-card">
              <p className="sidebar-guest-text">Sign in to access all features</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSidebarOpen(false);
                  router.push("/patient/register");
                }}
              >
                <LoginIcon />
                Login / Register
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Menu</div>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/patient/history");
            }}
          >
            <HistoryIcon />
            Chat History
          </button>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/patient/profile");
            }}
          >
            <ProfileIcon />
            My Profile
          </button>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/patient/monitor");
            }}
          >
            <MonitorIcon />
            Health Monitor
          </button>



          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/patient/surgery");
            }}
          >
            <span className="text-xl mr-3">🏥</span>
            Surgery Centre
          </button>

          <div className="sidebar-nav-label" style={{ marginTop: '16px' }}>Documents</div>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              setShowUploadModal(true);
            }}
          >
            <FileUploadIcon />
            Upload Document
          </button>

          <div className="sidebar-nav-label" style={{ marginTop: '16px' }}>Portal</div>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/doctor/login");
            }}
          >
            <UserIcon />
            Doctor Portal
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {patient ? (
            <button
              className="sidebar-footer-btn"
              onClick={() => {
                setSidebarOpen(false);
                handleLogout();
              }}
            >
              <LogOutIcon />
              Logout
            </button>
          ) : (
            <button
              className="sidebar-footer-btn login-btn"
              onClick={() => {
                setSidebarOpen(false);
                router.push("/patient/register");
              }}
            >
              <LoginIcon />
              Login / Register
            </button>
          )}
        </div>
      </aside>

      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-icon">
            <HeartPulseIcon />
          </div>
          <h1>HealthConnect</h1>
          <p>Your intelligent health assistant</p>
        </div>

        {/* Patient Info Bar - Simplified since sidebar has actions now */}
        <div className="patient-bar">
          {patient ? (
            <>
              <div className="patient-info">
                <span className="patient-name">Welcome, {patient.name}</span>
              </div>
              <div className="patient-actions">
                <LanguageDropdown
                  onSelect={handleLanguageChange}
                  selectedLanguage={language}
                />
              </div>
            </>
          ) : (
            <>
              <div className="patient-info">
                <span className="text-muted">Chat freely - register when booking</span>
              </div>
              <div className="patient-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LanguageDropdown
                  onSelect={handleLanguageChange}
                  selectedLanguage={language}
                />
                <button onClick={() => router.push("/patient/register")} className="btn btn-primary btn-sm">
                  <UserPlusIcon />
                  Register / Login
                </button>
              </div>
            </>
          )}
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i}>
                <ChatBubble text={msg.text} sender={msg.sender} />

                {msg.useDropdown && (
                  <div className="option-menu">
                    <LanguageDropdown
                      onSelect={handleOptionSelect}
                      selectedLanguage={language}
                    />
                  </div>
                )}

                {msg.options && (
                  <div className="option-menu">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        className="option-btn"
                        onClick={() => handleOptionSelect(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              className="form-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                language && LANGUAGES[language]
                  ? LANGUAGES[language].placeholder
                  : "Describe your symptoms..."
              }
            />
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-attachment"
              title="Upload Document"
            >
              <FileUploadIcon />
            </button>
            <button onClick={handleSend} className="btn btn-primary">
              <SendIcon />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="upload-modal-header">
                <div className="upload-modal-icon">
                  <FileUploadIcon />
                </div>
                <div>
                  <h3>Upload Medical Document</h3>
                  <p>Attach lab reports, X-rays, or prescriptions</p>
                </div>
                <button
                  className="upload-modal-close"
                  onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Upload Zone */}
              <div
                className={`upload-zone ${selectedFile ? 'has-file' : ''}`}
                onClick={() => document.getElementById('file-input').click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
                    if (validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
                      setSelectedFile(file);
                    }
                  }
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {selectedFile ? (
                  <div className="upload-file-preview">
                    <div className="upload-file-icon">
                      {selectedFile.type.includes('pdf') ? '📄' : '🖼️'}
                    </div>
                    <div className="upload-file-info">
                      <span className="upload-file-name">{selectedFile.name}</span>
                      <span className="upload-file-size">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      className="upload-file-remove"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-placeholder-icon">📁</div>
                    <span className="upload-placeholder-text">
                      Drag & drop or <strong>browse</strong>
                    </span>
                    <span className="upload-placeholder-hint">
                      PDF, JPG, PNG up to 10MB
                    </span>
                  </div>
                )}
              </div>

              {/* Supported Types */}
              <div className="upload-types">
                <div className="upload-type">
                  <span className="upload-type-icon">📋</span>
                  <span>Lab Reports</span>
                </div>
                <div className="upload-type">
                  <span className="upload-type-icon">🩻</span>
                  <span>X-rays / Scans</span>
                </div>
                <div className="upload-type">
                  <span className="upload-type-icon">💊</span>
                  <span>Prescriptions</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="upload-actions">
                <button
                  onClick={handleUploadDocument}
                  className="upload-action-btn analyze"
                  disabled={!selectedFile || uploadingFile}
                >
                  <span className="upload-action-icon">🤖</span>
                  <div className="upload-action-content">
                    <span className="upload-action-title">
                      {uploadingFile ? 'Analyzing...' : 'Analyze with AI'}
                    </span>
                    <span className="upload-action-desc">Get instant medical insights</span>
                  </div>
                </button>

                <button
                  onClick={async () => {
                    if (!selectedFile) return;
                    // Just attach without AI analysis
                    setSessionDocuments(prev => [...prev, {
                      name: selectedFile.name,
                      type: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
                      url: '#',
                      attachedAt: new Date().toISOString()
                    }]);
                    setMessages(prev => [
                      ...prev,
                      { text: `📎 Attached: ${selectedFile.name}\n\nThis document will be shared with your doctor.`, sender: 'user' }
                    ]);
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="upload-action-btn attach"
                  disabled={!selectedFile || uploadingFile}
                >
                  <span className="upload-action-icon">👨‍⚕️</span>
                  <div className="upload-action-content">
                    <span className="upload-action-title">Attach for Doctor</span>
                    <span className="upload-action-desc">Share with your healthcare provider</span>
                  </div>
                </button>
              </div>

              {/* Footer Note */}
              <div className="upload-footer">
                <span className="upload-footer-icon">🔒</span>
                <span>Your documents are securely stored and only visible to you and your doctor.</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="nav-links">
          <a href="/doctor/login" className="nav-link">
            <UserIcon />
            Doctor Portal
          </a>
        </div>
      </div>
    </div>
  );
}