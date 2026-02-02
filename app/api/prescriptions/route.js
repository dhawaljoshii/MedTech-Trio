import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'prescriptions.json';

// GET - Get prescriptions (filter by patientId or doctorName)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');
        const doctorName = searchParams.get('doctor');

        let prescriptions = await readDB(DB_FILE);

        if (patientId) {
            prescriptions = prescriptions.filter(p => p.patientId === patientId);
        }

        if (doctorName) {
            prescriptions = prescriptions.filter(p => p.doctorName === doctorName);
        }

        // Sort by most recent
        prescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return NextResponse.json(prescriptions);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new prescription
export async function POST(request) {
    try {
        const body = await request.json();
        const { patientId, patientName, doctorName, doctorType, diagnosis, medicines, notes, attachments } = body;

        if (!patientId || !doctorName || (!medicines && !notes)) {
            return NextResponse.json(
                { error: 'Patient ID, Doctor Name, and either Medicines or Notes are required' },
                { status: 400 }
            );
        }

        const prescriptions = await readDB(DB_FILE);

        const newPrescription = {
            id: generateId(),
            patientId,
            patientName,
            doctorName,
            doctorType,
            diagnosis,
            medicines: medicines || "", // Array or string
            notes,
            attachments: attachments || [], // Array of { name, type, url }
            createdAt: new Date().toISOString()
        };

        prescriptions.push(newPrescription);
        await writeDB(DB_FILE, prescriptions);

        return NextResponse.json(newPrescription, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
