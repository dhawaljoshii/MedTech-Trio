export const triageWorkflow = {
    /**
     * Execute the Triage Workflow
     * @param {Object} model
     * @param {Array} messages
     * @param {Object} state
     * @param {String} context
     * @param {String} language
     */
    async execute(model, messages, state, context, language) {
        const systemPrompt = `
    You are an Emergency Triage Nurse.
    
    Current Workflow: TRIAGE
    Current Step: ${state.step || 'Assessment'}
    
    GOAL: Rapidly assess if the patient has life-threatening symptoms.
    
    GUIDELINES:
    1. If the patient mentions Chest Pain, severe difficulty breathing, stroke symptoms (FAST), or heavy bleeding:
       - IMMEDIATELY command them to call 911 or go to the ER.
       - Do NOT ask for more details.
       - Use uppercase for "CALL 911 NOW".
    2. If symptoms are urgent but not life-threatening (e.g. high fever, broken bone):
       - Recommend Urgent Care.
    3. If symptoms are mild:
       - Advise scheduling a routine appointment.
       
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
