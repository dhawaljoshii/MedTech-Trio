import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'patients.json';

// GET - Get patient by ID or mobile
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const mobile = searchParams.get('mobile');

        const patients = await readDB(DB_FILE);

        if (id) {
            const patient = patients.find(p => p.id === id);
            if (!patient) {
                return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
            }
            return NextResponse.json(patient);
        }

        if (mobile) {
            const patient = patients.find(p => p.mobile === mobile);
            if (!patient) {
                return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
            }
            return NextResponse.json(patient);
        }

        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Register new patient
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, age, mobile, email } = body;

        if (!name || !mobile) {
            return NextResponse.json(
                { error: 'Name and mobile are required' },
                { status: 400 }
            );
        }

        const patients = await readDB(DB_FILE);

        // Check if patient already exists
        const existing = patients.find(p => p.mobile === mobile);
        if (existing) {
            return NextResponse.json(existing);
        }

        const newPatient = {
            id: generateId(),
            name,
            age: age || null,
            mobile,
            email: email || null,
            createdAt: new Date().toISOString()
        };

        patients.push(newPatient);
        await writeDB(DB_FILE, patients);

        return NextResponse.json(newPatient, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// PATCH - Update patient details (Medical History)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, medicalHistory } = body;

        if (!id) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        const patients = await readDB(DB_FILE);
        const index = patients.findIndex(p => p.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // Update fields
        if (medicalHistory) {
            // Ensure any new surgeries have IDs
            if (medicalHistory.surgeries) {
                medicalHistory.surgeries = medicalHistory.surgeries.map(s => ({
                    ...s,
                    id: s.id || generateId()
                }));
            }

            patients[index].medicalHistory = {
                ...patients[index].medicalHistory,
                ...medicalHistory
            };
        }

        await writeDB(DB_FILE, patients);

        return NextResponse.json(patients[index]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
