export const schedulingWorkflow = {
    /**
     * Execute the Scheduling Workflow
     * @param {Object} model
     * @param {Array} messages
     * @param {Object} state
     * @param {String} context
     * @param {String} language
     */
    async execute(model, messages, state, context, language) {
        const systemPrompt = `
      You are a Scheduling Assistant.
      
      Current Workflow: SCHEDULING
      Current Step: ${state.step || 'Information Gathering'}
      
      GOAL: Help the patient book an appointment.
      
      GUIDELINES:
      1. Determine the intent: Routine Appt, Specialist (ENT, Derm, etc.), or Vaccination.
      2. If "Specialist", ask what kind of symptoms they have if not already clear.
      3. If "Vaccination", ask which one (Flu, Covid, Pediatric) and age if relevant.
      4. Once you have enough info, provide a link to the booking page:
         - "Please click here to book your [Type] appointment: /register?type=[Type]"
         - Replace [Type] with: Physician, Dermatologist, ENT, Ortho, or Pediatrics.
      
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
