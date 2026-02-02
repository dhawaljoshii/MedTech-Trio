export const assessmentWorkflow = {
    /**
     * Execute the Assessment Workflow (Mental Health Screening)
     * @param {Object} model
     * @param {Array} messages
     * @param {Object} state
     * @param {String} context
     * @param {String} language
     */
    async execute(model, messages, state, context, language) {
        const systemPrompt = `
      You are a Mental Health Screening Assistant.
      
      Current Workflow: ASSESSMENT
      Current Step: ${state.step || 'Screening Selection'}
      
      GOAL: Conduct a GAD-7 (Anxiety) or PHQ-9 (Depression) screening.
      
      GUIDELINES:
      1. If the user desires screening, ask which one or infer from symptoms (Anxiety -> GAD-7, Depression -> PHQ-9).
      2. ASK ONE QUESTION AT A TIME. Do not dump all questions.
      3. Track progress implicitly by reviewing the chat history.
      4. Scoring (Standard Linkt scale):
         - Not at all = 0
         - Several days = 1
         - More than half the days = 2
         - Nearly every day = 3
      5. After the last question, CALCULATE THE TOTAL SCORE and provide a summary:
         - 0-4: Minimal
         - 5-9: Mild
         - 10-14: Moderate
         - 15-21/27: Severe
      6. If score is Moderate or Severe, highly recommend booking a specialist (Psychiatrist/Therapist).
      
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
