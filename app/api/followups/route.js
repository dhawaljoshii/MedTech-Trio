import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'followups.json';

// GET - Fetch followups for a patient
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
        }

        const followups = await readDB(DB_FILE);
        const patientFollowups = followups
            .filter(f => f.patientId === patientId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json(patientFollowups);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Add a new followup task
export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, task, doctorId, doctorName, surgeryId } = body;

        if (!patientId || !task) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const followups = await readDB(DB_FILE);

        const newFollowup = {
            id: generateId(),
            patientId,
            doctorId,
            doctorName: doctorName || "Doctor",
            task,
            status: "pending", // pending | completed
            surgeryId, // Optional: associated surgery ID
            createdAt: new Date().toISOString()
        };

        followups.push(newFollowup);
        await writeDB(DB_FILE, followups);

        return NextResponse.json(newFollowup, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update status (Toggle complete)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const followups = await readDB(DB_FILE);
        const index = followups.findIndex(f => f.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        followups[index].status = status;
        followups[index].completedAt = status === 'completed' ? new Date().toISOString() : null;

        await writeDB(DB_FILE, followups);

        return NextResponse.json(followups[index]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Remove a followup task
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
        }

        const followups = await readDB(DB_FILE);
        const index = followups.findIndex(f => f.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        followups.splice(index, 1);
        await writeDB(DB_FILE, followups);

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
