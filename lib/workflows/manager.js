/**
 * WorkflowManager
 * 
 * Responsibilities:
 * 1. Maintain conversation state (intent, current step, collected data)
 * 2. Route messages to the appropriate specialized workflow
 * 3. Fallback to General/RAG if no specific workflow is active
 */

import { triageWorkflow } from './triage.js';
import { schedulingWorkflow } from './scheduling.js';
import { assessmentWorkflow } from './assessment.js';
import { onboardingWorkflow } from './onboarding.js';
import { careWorkflow } from './care.js';

// Map of intents to workflow handlers
const WORKFLOWS = {
    TRIAGE: triageWorkflow,
    SCHEDULING: schedulingWorkflow,
    ASSESSMENT: assessmentWorkflow,
    ONBOARDING: onboardingWorkflow,
    CARE: careWorkflow,
};

export class WorkflowManager {
    constructor(model) {
        this.model = model;
    }

    /**
     * Main entry point for processing a message
     * @param {Array} messages - Full conversation history
     * @param {Object} context - RAG context string
     * @returns {Object} response - { content: string, state: object }
     */
    async processMessage(messages, context, language = 'en') {
        const lastMessage = messages[messages.length - 1];
        const userContent = lastMessage.content;

        // 1. Analyze Intent & Current State
        // In a real app, we'd pass a state object from the client or DB.
        // Here, we'll ask the LLM to determine the current state/intent based on history.
        const state = await this.determineState(messages);

        // 2. Route to Workflow
        if (state.currentWorkflow && WORKFLOWS[state.currentWorkflow]) {
            // Execute the specific workflow step
            // We pass the model instead of openai
            return await WORKFLOWS[state.currentWorkflow].execute(this.model, messages, state, context, language);
        }

        // 3. Fallback: General Chat / RAG
        return await this.generalChat(messages, context, language);
    }

    /**
     * Determine the current workflow state using the LLM
     */
    async determineState(messages) {
        // Construct history for context
        const recentHistory = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');

        const systemPrompt = `
      Analyze the conversation history and determine the active clinical workflow.
      
      Available Workflows:
      - TRIAGE: Chest pain, emergencies, severe symptoms, postpartum issues.
      - SCHEDULING: Booking appointments, vaccinations, specialist consults.
      - ASSESSMENT: Mental health screenings (PHQ-9, GAD-7) or symptom checks.
      - ONBOARDING: New patient registration, consent.
      - CARE: Chronic disease management, post-op follow-up, medication questions, cancer care.
      - GENERAL: General health questions, chit-chat, or ambiguous inputs.

      Return ONLY a raw JSON object (no markdown formatting):
      {
        "currentWorkflow": "TRIAGE" | "SCHEDULING" | "ASSESSMENT" | "ONBOARDING" | "CARE" | "GENERAL",
        "step": "string describing current step in flow",
        "data": { ...any extracted data... }
      }
      
      Conversation History:
      ${recentHistory}
      
      If the user just started or switched topics, infer the NEW workflow.
      If it's a continuation, maintain the current workflow.
    `;

        try {
            const result = await this.model.generateContent(systemPrompt);
            const responseText = result.response.text();

            // Clean up code blocks if present
            const cleanText = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error("Error determining state:", error);
            return { currentWorkflow: "GENERAL" };
        }
    }

    /**
     * Fallback for general RAG-based chat
     */
    /**
     * Fallback for general RAG-based chat
     */
    async generalChat(messages, context, language) {
        const systemPrompt = `You are a helpful and empathetic Triage Nurse Assistant.
    
    CONTEXT:
    ${context}

    Your goal is to answer questions based on the context. 
    If you detect a need for a specific workflow (e.g. they say "I need an appointment"), 
    you can suggest it, but for now just answer helpfuly.
    
    CRITICAL: If symptoms are life-threatening (chest pain, trouble breathing), advise ER immediately.

    IMPORTANT: Reply in the language "${language}".
    `;

        // Note: We return streamable arguments or handle streaming in the route
        // For consistency with the workflow structure, we'll return the completion config
        // and let the route handle the actual streaming call if possible, 
        // OR we just return the system prompt and let the route do the final generation.

        // To keep it simple for this implementation: We return the system prompt 
        // and let the main route handle the final generation to the user,
        // BUT since workflows might need multi-step logic, it's better if we return
        // the messages to send to OpenAI.

        return {
            type: 'chat',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ]
        };
    }
}
