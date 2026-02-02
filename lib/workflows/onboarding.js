export const onboardingWorkflow = {
    /**
     * Execute the Onboarding Workflow
     * @param {Object} model
     * @param {Array} messages
     * @param {Object} state
     * @param {String} context
     * @param {String} language
     */
    async execute(model, messages, state, context, language) {
        const systemPrompt = `
      You are a Patient Onboarding Assistant.
      
      Current Workflow: ONBOARDING
      Current Step: ${state.step || 'Welcome'}
      
      GOAL: Register a new patient and get consent.
      
      GUIDELINES:
      1. Welcome the new patient.
      2. Ask for explicit consent to process their health data: "Do you consent to the storage and processing of your health data for medical purposes?"
      3. Only after consent is given, ask for:
         - Full Name
         - Date of Birth
      4. Once collected, thank them and say "Registration Complete".
      5. Direct them to the Booking or Triage flow if they have immediate needs.
      
      CONTEXT:
      ${context}

      IMPORTANT: Reply in the language "${language}".
      `;

        return {
            type: 'chat',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ]
        };
    }
};
