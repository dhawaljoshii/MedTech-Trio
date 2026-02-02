import { WorkflowManager } from '../lib/workflows/manager.js';
import { MockOpenAI } from '../lib/mock-ai.js';

// Use the actual MockOpenAI class
const mockOpenAI = new MockOpenAI();

async function test() {
    console.log("Starting WorkflowManager Tests...");
    const manager = new WorkflowManager(mockOpenAI);

    const testCases = [
        { input: "I have severe chest pain", expected: "TRIAGE" },
        { input: "I need to book an appointment", expected: "SCHEDULING" },
        { input: "I've been feeling really depressed lately", expected: "ASSESSMENT" },
        { input: "I am a new patient", expected: "ONBOARDING" },
        { input: "I need help managing my diabetes", expected: "CARE" },
        { input: "Hello there", expected: "GENERAL" }
    ];

    for (const test of testCases) {
        // We spy on determineState by seeing what it resolves to effectively, 
        // but since processMessage calls workflow.execute, we can check the returned system prompt to see if it matches.

        const response = await manager.processMessage([{ role: 'user', content: test.input }], "Mock Context");

        // Extract the system prompt to check which workflow ran
        const systemMsg = response.messages ? response.messages.find(m => m.role === 'system').content : 'General Chat';

        let detected = 'UNKNOWN';
        if (systemMsg.includes('Current Workflow: TRIAGE')) detected = 'TRIAGE';
        else if (systemMsg.includes('Current Workflow: SCHEDULING')) detected = 'SCHEDULING';
        else if (systemMsg.includes('Current Workflow: ASSESSMENT')) detected = 'ASSESSMENT';
        else if (systemMsg.includes('Current Workflow: ONBOARDING')) detected = 'ONBOARDING';
        else if (systemMsg.includes('Current Workflow: CARE')) detected = 'CARE';
        else if (systemMsg.includes('Triage Nurse Assistant')) detected = 'GENERAL';

        if (detected === test.expected) {
            console.log(`[PASS] Input: "${test.input}" -> Routed to: ${detected}`);
        } else {
            console.error(`[FAIL] Input: "${test.input}" -> Expected: ${test.expected}, Got: ${detected}`);
        }
    }
}

test().catch(console.error);
