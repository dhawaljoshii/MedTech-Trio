import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'chats.json';

// GET - Get chat history for a patient
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        let chats = await readDB(DB_FILE);

        if (patientId) {
            chats = chats.filter(c => c.patientId === patientId);
        }

        // Sort by most recent first
        chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json(chats);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Save a new chat session
export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, patientName, symptoms, doctorType, messages, documents } = body;

        if (!symptoms) {
            return NextResponse.json(
                { error: 'Symptoms are required' },
                { status: 400 }
            );
        }

        const chats = await readDB(DB_FILE);

        const newChat = {
            id: generateId(),
            patientId: patientId || null,
            patientName: patientName || 'Anonymous',
            symptoms,
            doctorType: doctorType || 'General',
            messages: messages || [],
            documents: documents || [],
            createdAt: new Date().toISOString()
        };

        chats.push(newChat);
        await writeDB(DB_FILE, chats);

        return NextResponse.json(newChat, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
