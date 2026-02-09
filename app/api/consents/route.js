import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

const CONSENTS_FILE = 'consents.json';

export async function POST(request) {
    try {
        const body = await request.json();
        const { patient_email, consents, signature, user_agent } = body;

        if (!patient_email || !consents || !signature) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get client IP
        const ip_address = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Read existing consents
        const allConsents = await readDB(CONSENTS_FILE);

        // Store consents
        const consentRecord = {
            patient_email,
            consents: consents.map(c => ({
                ...c,
                ip_address,
                user_agent,
                signature
            })),
            accepted_at: new Date().toISOString(),
            ip_address,
            user_agent,
            signature
        };

        // Update or add consent record
        const existingIndex = allConsents.findIndex(c => c.patient_email === patient_email);
        if (existingIndex >= 0) {
            allConsents[existingIndex] = consentRecord;
        } else {
            allConsents.push(consentRecord);
        }

        // Save to file
        await writeDB(CONSENTS_FILE, allConsents);

        return NextResponse.json({
            success: true,
            message: 'Consents accepted successfully',
            consents_accepted: consents.length
        });
    } catch (error) {
        console.error('Error saving consents:', error);
        return NextResponse.json(
            { error: 'Failed to save consents' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter required' },
                { status: 400 }
            );
        }

        // Read consents from file
        const allConsents = await readDB(CONSENTS_FILE);
        const record = allConsents.find(c => c.patient_email === email);

        if (!record) {
            return NextResponse.json({
                has_consents: false,
                consents: []
            });
        }

        return NextResponse.json({
            has_consents: true,
            consents: record.consents,
            accepted_at: record.accepted_at
        });
    } catch (error) {
        console.error('Error fetching consents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch consents' },
            { status: 500 }
        );
    }
}
