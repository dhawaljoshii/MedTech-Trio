import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const surgeryId = searchParams.get('surgeryId');

    const complications = await readDB('complications') || [];

    let filtered = complications;
    if (patientId) {
        filtered = filtered.filter(c => c.patientId === patientId);
    }
    if (surgeryId) {
        filtered = filtered.filter(c => c.surgeryId === surgeryId);
    }

    return NextResponse.json(filtered);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, surgeryId, description } = body;

        if (!patientId || !surgeryId || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const complications = await readDB('complications') || [];
        const newComplication = {
            id: generateId(),
            patientId,
            surgeryId,
            description,
            status: 'pending', // 'pending' | 'resolved'
            solution: null,
            reportedAt: new Date().toISOString(),
            resolvedAt: null
        };

        complications.push(newComplication);
        await writeDB('complications', complications);

        return NextResponse.json(newComplication);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create complication' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, solution, status } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing complication ID' }, { status: 400 });
        }

        const complications = await readDB('complications') || [];
        const index = complications.findIndex(c => c.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Complication not found' }, { status: 404 });
        }

        if (solution !== undefined) complications[index].solution = solution;
        if (status !== undefined) {
            complications[index].status = status;
            if (status === 'resolved') {
                complications[index].resolvedAt = new Date().toISOString();
            }
        }

        await writeDB('complications', complications);
        return NextResponse.json(complications[index]);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update complication' }, { status: 500 });
    }
}
