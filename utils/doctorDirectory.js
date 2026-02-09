export const DOCTOR_DIRECTORY = {
  // 🫀 Cardiology - Heart and cardiovascular conditions
  cardiologist: [
    {
      name: "Dr. Sharma",
      specialization: "Cardiology",
      hospitalId: "hosp_1",
    },
    {
      name: "Dr. Mehta",
      specialization: "Cardiology",
      hospitalId: "hosp_2",
    },
  ],

  // 🩺 General Medicine - Common illnesses, routine checkups
  "general-physician": [
    {
      name: "Dr. Patil",
      specialization: "General Medicine",
      hospitalId: "hosp_1",
    },
  ],

  // 🧠 Psychiatry - Mental health conditions
  psychiatrist: [
    {
      name: "Dr. Anuj Kandpal",
      specialization: "Psychiatrist",
      hospitalId: "hosp_2",
    },
  ],

  // 👶 Pediatrics - Children's health
  pediatrician: [
    {
      name: "Dr. Mishra",
      specialization: "Pediatrician",
      hospitalId: "hosp_1",
    },
  ],

  // 🦴 Orthopedics - Bones, joints, muscles, fractures
  orthopedic: [
    {
      name: "Dr. Kumar",
      specialization: "Orthopedic Surgeon",
      hospitalId: "hosp_1",
    },
    {
      name: "Dr. Reddy",
      specialization: "Orthopedics",
      hospitalId: "hosp_2",
    },
  ],

  // 🫁 Pulmonology - Lungs, respiratory conditions
  pulmonologist: [
    {
      name: "Dr. Desai",
      specialization: "Pulmonology",
      hospitalId: "hosp_1",
    },
    {
      name: "Dr. Singh",
      specialization: "Respiratory Medicine",
      hospitalId: "hosp_2",
    },
  ],

  // 🧠 Neurology - Brain, nerves, stroke, seizures
  neurologist: [
    {
      name: "Dr. Iyer",
      specialization: "Neurology",
      hospitalId: "hosp_1",
    },
  ],

  // 🩹 Dermatology - Skin conditions
  dermatologist: [
    {
      name: "Dr. Kapoor",
      specialization: "Dermatology",
      hospitalId: "hosp_2",
    },
  ],

  // 👂 ENT - Ear, Nose, Throat
  ent: [
    {
      name: "Dr. Joshi",
      specialization: "ENT Specialist",
      hospitalId: "hosp_1",
    },
  ],

  // 🍽️ Gastroenterology - Digestive system
  gastroenterologist: [
    {
      name: "Dr. Nair",
      specialization: "Gastroenterology",
      hospitalId: "hosp_2",
    },
  ],

  // 👁️ Ophthalmology - Eyes
  ophthalmologist: [
    {
      name: "Dr. Verma",
      specialization: "Ophthalmology",
      hospitalId: "hosp_1",
    },
  ],
};

// 🗺️ DISEASE/SYMPTOM TO SPECIALIST MAPPING
// This ensures correct specialist assignment for any condition
export const SYMPTOM_TO_SPECIALIST = {
  // Cardiac/Heart
  "chest pain": "cardiologist",
  "heart attack": "cardiologist",
  "heart palpitations": "cardiologist",
  "irregular heartbeat": "cardiologist",
  "high blood pressure": "cardiologist",
  "cardiac arrest": "cardiologist",

  // Respiratory/Lungs
  "breathing difficulty": "pulmonologist",
  "asthma": "pulmonologist",
  "chronic cough": "pulmonologist",
  "pneumonia": "pulmonologist",
  "tuberculosis": "pulmonologist",
  "copd": "pulmonologist",

  // Bones/Joints/Muscles
  "fracture": "orthopedic",
  "broken bone": "orthopedic",
  "joint pain": "orthopedic",
  "arthritis": "orthopedic",
  "back pain": "orthopedic",
  "sports injury": "orthopedic",

  // Brain/Nerves
  "stroke": "neurologist",
  "seizure": "neurologist",
  "paralysis": "neurologist",
  "migraine": "neurologist",
  "epilepsy": "neurologist",
  "nerve pain": "neurologist",

  // Skin
  "rash": "dermatologist",
  "acne": "dermatologist",
  "eczema": "dermatologist",
  "psoriasis": "dermatologist",
  "skin infection": "dermatologist",

  // Ear/Nose/Throat
  "ear pain": "ent",
  "hearing loss": "ent",
  "sinus infection": "ent",
  "tonsillitis": "ent",
  "throat infection": "ent",

  // Digestive
  "abdominal pain": "gastroenterologist",
  "stomach pain": "gastroenterologist",
  "diarrhea": "gastroenterologist",
  "constipation": "gastroenterologist",
  "acid reflux": "gastroenterologist",
  "ulcer": "gastroenterologist",

  // Eyes
  "vision problems": "ophthalmologist",
  "eye pain": "ophthalmologist",
  "blurred vision": "ophthalmologist",
  "eye infection": "ophthalmologist",

  // Mental Health
  "depression": "psychiatrist",
  "anxiety": "psychiatrist",
  "panic attack": "psychiatrist",
  "suicidal thoughts": "psychiatrist",

  // Children
  "child fever": "pediatrician",
  "vaccination": "pediatrician",
  "growth issues": "pediatrician",
};
