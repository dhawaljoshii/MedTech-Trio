/**
 * MockOpenAI
 * 
 * Simulates OpenAI behavior using keyword matching and template responses.
 * Used when no API key is provided.
 */

export class MockOpenAI {
    constructor(config) {
        this.apiKey = 'mock-key';
        this.chat = {
            completions: {
                create: this.createCompletion.bind(this)
            }
        };
        this.embeddings = {
            create: async () => ({ data: [{ embedding: new Array(1536).fill(0) }] })
        };
    }

    async createCompletion({ messages, response_format }) {
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage.content.toLowerCase();
        const systemPromptMessage = messages.find(m => m.role === 'system');
        const systemPrompt = systemPromptMessage ? systemPromptMessage.content : '';

        let responseContent = '';

        // 1. If we are determining state (JSON output)
        if (response_format && response_format.type === 'json_object') {
            responseContent = this.mockDetermineState(content);
        }
        // 2. If we are executing a workflow (Standard Chat)
        else {
            responseContent = this.mockChatResponse(content, systemPrompt);
        }

        return {
            choices: [{
                message: {
                    content: responseContent
                },
                delta: {
                    content: responseContent
                }
            }],
            [Symbol.asyncIterator]: async function* () {
                yield { choices: [{ delta: { content: responseContent } }] };
            }
        };
    }

    /**
     * Mock State Determination Logic
     */
    mockDetermineState(text) {
        let workflow = 'GENERAL';
        let step = 'Start';

        if (text.includes('chest pain') || text.includes('breathing') || text.includes('emergency') || text.includes('bleeding')) {
            workflow = 'TRIAGE';
        } else if (text.includes('book') || text.includes('appointment') || text.includes('schedule') || text.includes('vaccin') || text.includes('consult')) {
            workflow = 'SCHEDULING';
        } else if (text.includes('depress') || text.includes('anxiety') || text.includes('anxious') || text.includes('sad') || text.includes('mental')) {
            workflow = 'ASSESSMENT';
        } else if (text.includes('new patient') || text.includes('register') || text.includes('sign up')) {
            workflow = 'ONBOARDING';
        } else if (text.includes('diabetes') || text.includes('surgery') || text.includes('medication') || text.includes('chronic') || text.includes('cancer')) {
            workflow = 'CARE';
        }

        return JSON.stringify({
            currentWorkflow: workflow,
            step: step,
            data: {}
        });
    }

    /**
     * Mock Chat Response Logic
     */
    mockChatResponse(text, systemPrompt) {
        // Basic responses for the different personas based on system prompt keywords

        if (systemPrompt.includes('Emergency Triage Nurse')) {
            if (text.includes('chest') || text.includes('pain') || text.includes('breath')) {
                return "CALL 911 NOW. Do not wait. This could be a life-threatening emergency.";
            }
            return "Can you describe your symptoms in more detail? Are you experiencing any severe pain?";
        }

        if (systemPrompt.includes('Scheduling Assistant')) {
            if (text.includes('physician')) return "Please click here to book your Physician appointment: /register?type=Physician";
            if (text.includes('derm')) return "Please click here to book your Dermatologist appointment: /register?type=Dermatologist";
            if (text.includes('ent')) return "Please click here to book your ENT appointment: /register?type=ENT";
            return "What kind of appointment do you need? We have Physicians, Dermatologists, ENT, and Orthopedics.";
        }

        if (systemPrompt.includes('Mental Health')) {
            if (text.includes('not at all')) return "Okay, next question: Over the last 2 weeks, have you felt down, depressed, or hopeless?";
            return "I can help screen for anxiety or depression. Would you like to start a screening?";
        }

        if (systemPrompt.includes('Onboarding')) {
            if (text.includes('consent') || text.includes('yes')) return "Thank you. What is your full name?";
            return "Welcome to HealthConnect. To proceed, do you consent to the processing of your health data?";
        }

        if (systemPrompt.includes('Care Manager')) {
            return "I can help you manage your condition. Please tell me your latest vitals or concerns.";
        }

        // Default General
        return "I am running in Demo Mode (No API Key). I detected the intent but cannot generate a full LLM response. Please try keywords like 'chest pain', 'book appointment', 'anxiety', 'new patient', or 'diabetes'.";
    }
}
