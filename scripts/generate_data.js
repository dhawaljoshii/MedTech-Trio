const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/documents/synthetic_medical_db.txt');
const TARGET_SIZE_MB = 10; // Start with 10MB to be safe, easier to scale to GB if needed

const diseases = ['Diabetes Type 2', 'Hypertension', 'Asthma', 'Influenza', 'Migraine', 'Arthritis', 'Dermatitis', 'Gastritis'];
const symptoms = ['fever', 'headache', 'nausea', 'dizziness', 'fatigue', 'pain', 'swelling', 'cough'];
const medications = ['Metformin', 'Lisinopril', 'Albuterol', 'Ibuprofen', 'Acetaminophen', 'Amoxicillin'];

const generateEntry = (i) => {
    const disease = diseases[i % diseases.length];
    const symptom1 = symptoms[i % symptoms.length];
    const symptom2 = symptoms[(i + 1) % symptoms.length];
    const med = medications[i % medications.length];

    return `
CASE RECORD #${i}
Condition: ${disease}
Patient ID: PT-${10000 + i}
Clinical Presentation: Patient presents with ${symptom1} and severe ${symptom2}. Reports symptoms started ${i % 7 + 1} days ago.
Diagnosis: Confirmed ${disease} based on clinical history and ${symptom1}.
Treatment Plan: Prescribed ${med} ${Math.floor(Math.random() * 500) + 100}mg daily.
Notes: Monitor for side effects. Follow up in 2 weeks.
Safety Warning: If ${symptom1} worsens, seek emergency care.
--------------------------------------------------
`;
};

const generate = () => {
    console.log(`Generating ${TARGET_SIZE_MB}MB of medical data...`);
    const stream = fs.createWriteStream(OUTPUT_FILE);

    let size = 0;
    let i = 0;

    while (size < TARGET_SIZE_MB * 1024 * 1024) {
        const entry = generateEntry(i++);
        stream.write(entry);
        size += Buffer.byteLength(entry);
    }

    stream.end();
    console.log(`Done! Created ${OUTPUT_FILE} (${(size / 1024 / 1024).toFixed(2)} MB)`);
};

generate();
