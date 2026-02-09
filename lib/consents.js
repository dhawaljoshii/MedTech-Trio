// Consent type definitions and content
export const CONSENT_TYPES = {
    MEDICAL_TREATMENT: {
        id: 'medical_treatment',
        name: 'Medical Treatment Consent',
        version: '1.0',
        isRequired: true,
        description: 'Authorization for medical examination, treatment, and procedures',
        content: `
# Medical Treatment Consent

I, the undersigned, hereby consent to medical treatment by the healthcare providers at this facility. I understand that:

## 1. Medical Examination & Treatment
I authorize healthcare providers to perform medical examinations, diagnostic procedures, and treatments deemed medically necessary for my care.

## 2. Risks and Benefits
I have been informed of the potential risks, benefits, and alternatives to proposed treatments. I understand that no guarantees have been made regarding the outcome of any treatment.

## 3. Right to Refuse
I understand I have the right to refuse any treatment and to withdraw this consent at any time. I also understand the potential consequences of refusing treatment.

## 4. Emergency Treatment
In case of emergency where I am unable to give consent, I authorize healthcare providers to perform necessary life-saving procedures.

## 5. Information Sharing
I understand my medical information will be shared among my healthcare team for treatment purposes.

## 6. Student Participation
I understand that medical students and residents may participate in my care under appropriate supervision.

By accepting this consent, I acknowledge that I have read, understood, and agree to the above terms.

**Version:** 1.0  
**Last Updated:** January 1, 2024
    `.trim()
    },

    PRIVACY_HIPAA: {
        id: 'privacy_hipaa',
        name: 'Privacy & Data Sharing Consent (HIPAA)',
        version: '1.0',
        isRequired: true,
        description: 'Authorization for health information use and disclosure under HIPAA',
        content: `
# Privacy & Data Sharing Consent (HIPAA)

I consent to the use and disclosure of my Protected Health Information (PHI) as follows:

## 1. Treatment
My PHI may be used by healthcare providers, nurses, technicians, and other personnel for treatment purposes.

## 2. Payment
My PHI may be used for billing, claims processing, and payment collection activities.

## 3. Healthcare Operations
My PHI may be used for quality improvement, staff training, accreditation, and administrative purposes.

## 4. Electronic Health Records
I consent to my health information being stored, transmitted, and accessed electronically through secure systems.

## 5. Third-Party Sharing
I understand my PHI may be shared with:
- Insurance companies for claims processing
- Laboratories and imaging centers for diagnostic services
- Specialists and consulting physicians for referrals
- Pharmacies for prescription fulfillment
- Government agencies as required by law

## 6. Your Rights
I understand I have the right to:
- Access and obtain copies of my health records
- Request corrections to my health information
- Request restrictions on certain uses of my PHI
- Receive an accounting of disclosures
- Revoke this consent in writing (except where action has already been taken)

## 7. Data Security
I understand that reasonable safeguards are in place to protect my PHI from unauthorized access or disclosure.

**Version:** 1.0  
**Last Updated:** January 1, 2024
    `.trim()
    },

    TELEMEDICINE: {
        id: 'telemedicine',
        name: 'Telemedicine Consent',
        version: '1.0',
        isRequired: false,
        description: 'Authorization for virtual healthcare consultations',
        content: `
# Telemedicine Consent

I consent to participate in telemedicine consultations and understand the following:

## 1. Definition
Telemedicine involves the use of electronic communications to enable healthcare providers to diagnose, treat, and provide care remotely.

## 2. Technology Requirements
- Stable internet connection required
- Video and audio capable device
- Private, quiet location recommended
- Technical issues may interrupt consultation

## 3. Limitations
- Physical examination limitations
- Not suitable for all medical conditions
- Emergency situations require in-person care
- Prescriptions subject to provider discretion

## 4. Privacy & Security
- Consultations conducted via secure, HIPAA-compliant platforms
- Sessions may be recorded for quality assurance (with notification)
- Third parties should not be present without provider consent

## 5. Emergency Protocols
In case of emergency during a telemedicine visit:
- Call 911 immediately
- Go to nearest emergency room
- Provider will assist in coordinating care

## 6. Billing
Telemedicine visits may be billed similarly to in-person visits and subject to insurance coverage.

**Version:** 1.0  
**Last Updated:** January 1, 2024
    `.trim()
    },

    MARKETING: {
        id: 'marketing',
        name: 'Marketing & Communications Consent',
        version: '1.0',
        isRequired: false,
        description: 'Authorization for promotional communications and health updates',
        content: `
# Marketing & Communications Consent

I consent to receive marketing and promotional communications:

## 1. Email Communications
- Health tips and wellness newsletters
- Appointment reminders and follow-ups
- New services and facility updates
- Seasonal health campaigns
- Patient satisfaction surveys

## 2. SMS/Text Messages
- Appointment reminders
- Prescription refill notifications
- Health alerts and tips
- Promotional offers

## 3. Phone Calls
- Appointment confirmations
- Follow-up care calls
- Patient satisfaction surveys
- Health program invitations

## 4. Opt-Out Rights
- You may opt-out at any time by:
  - Clicking "unsubscribe" in emails
  - Replying "STOP" to text messages
  - Contacting our office directly
- Opting out will not affect your medical care

## 5. Data Usage
- Contact information used only for communications
- No sale of personal information to third parties
- Compliance with CAN-SPAM and TCPA regulations

**Version:** 1.0  
**Last Updated:** January 1, 2024
    `.trim()
    },

    RESEARCH: {
        id: 'research',
        name: 'Research & Analytics Consent',
        version: '1.0',
        isRequired: false,
        description: 'Authorization for de-identified data use in research',
        content: `
# Research & Analytics Consent

I consent to the use of my de-identified health information for research and quality improvement:

## 1. De-Identified Data
- Personal identifiers removed (name, address, dates, etc.)
- Data aggregated with other patients
- Cannot be traced back to individual patients

## 2. Research Purposes
- Medical research studies
- Clinical outcome analysis
- Treatment effectiveness studies
- Public health research
- Disease surveillance

## 3. Quality Improvement
- Healthcare quality metrics
- Patient safety initiatives
- Process improvement projects
- Benchmarking and comparisons

## 4. Data Security
- Secure storage and transmission
- Access limited to authorized researchers
- Compliance with research ethics standards

## 5. No Direct Benefit
- Participation does not directly benefit your care
- Results may benefit future patients
- No compensation provided

## 6. Voluntary Participation
- Completely voluntary
- Can withdraw consent at any time
- Withdrawal does not affect your medical care

**Version:** 1.0  
**Last Updated:** January 1, 2024
    `.trim()
    }
};

// Helper function to get required consents
export const getRequiredConsents = () => {
    return Object.values(CONSENT_TYPES).filter(consent => consent.isRequired);
};

// Helper function to get optional consents
export const getOptionalConsents = () => {
    return Object.values(CONSENT_TYPES).filter(consent => !consent.isRequired);
};

// Helper function to get all consents
export const getAllConsents = () => {
    return Object.values(CONSENT_TYPES);
};
