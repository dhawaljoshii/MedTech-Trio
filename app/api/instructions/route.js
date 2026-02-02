import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'instructions.json';

// GET - Fetch instructions for a patient
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
        }

        const instructions = await readDB(DB_FILE);
        const patientInstructions = instructions
            .filter(i => i.patientId === patientId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json(patientInstructions);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Add a new instruction
export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, doctorId, doctorName, type, content, surgeryId } = body;

        if (!patientId || !content || !type) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const instructions = await readDB(DB_FILE);

        const newInstruction = {
            id: generateId(),
            patientId,
            doctorId,  // Optional: purely for record keeping
            doctorName: doctorName || "Doctor",
            type, // "regulation" | "warning"
            content,
            surgeryId, // Optional: associated surgery ID
            createdAt: new Date().toISOString()
        };

        instructions.push(newInstruction);
        await writeDB(DB_FILE, instructions);

        return NextResponse.json(newInstruction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove an instruction
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Instruction ID required' }, { status: 400 });
        }

        const instructions = await readDB(DB_FILE);
        const index = instructions.findIndex(i => i.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Instruction not found' }, { status: 404 });
        }

        instructions.splice(index, 1);
        await writeDB(DB_FILE, instructions);

        return NextResponse.json({ message: 'Instruction deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
