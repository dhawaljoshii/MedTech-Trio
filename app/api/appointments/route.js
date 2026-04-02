import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

const DB_FILE = 'appointments.json';

// GET - Get appointments (optionally filter by doctor or patient)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorName = searchParams.get('doctor');
        const patientId = searchParams.get('patientId');

        let appointments = await readDB(DB_FILE);

        if (doctorName !== null) {
            const lowerDoctor = doctorName.toLowerCase().trim();
            if (lowerDoctor === "") {
                // If doctor param depends on the use case.
                // If strictly filtering: return empty? Or return keys where doctor is not assigned?
                // For this app, let's assume if you search for empty, you get empty.
                // But usually, an empty param might mean "all" in some APIs.
                // However, based on the implementation plan, we want to prevent showing ALL when name is missing.
                // But wait, if the frontend sends `?doctor=` (empty string), `searchParams.get('doctor')` is "" (falsy) but not null.
                // If it sends nothing, it is null.
                // Let's rely on standard logic: if param is present, filter.
                appointments = [];
            } else {
                appointments = appointments.filter(a =>
                    a.doctorName && a.doctorName.toLowerCase().includes(lowerDoctor)
                );
            }
        }

        if (patientId) {
            appointments = appointments.filter(a => a.patientId === patientId);
        }

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new appointment
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            patientId,
            patientName,
            doctorType,
            doctorName,
            slot,
            symptoms,
            appointmentType,
            vaccines,
            hospitalId,
            documents, // ✅ New field
        } = body;

        if (!patientName || !doctorName || !slot) {
            return NextResponse.json(
                { error: 'Patient name, doctor name, and slot are required' },
                { status: 400 }
            );
        }

        const appointments = await readDB(DB_FILE);

        // 🕒 Vaccination reminder logic
        let reminderAt = null;

        if (appointmentType === "vaccination" && slot) {
            const datePart = slot.split("|")[0].trim(); // YYYY-MM-DD
            const vaccinationDate = new Date(datePart);

            // Reminder 1 day before at 9 AM
            reminderAt = new Date(vaccinationDate);
            reminderAt.setDate(reminderAt.getDate() - 1);
            reminderAt.setHours(9, 0, 0, 0);
        }


        const newAppointment = {
            id: generateId(),
            patientId: patientId || null,
            patientName,
            doctorType,
            doctorName,
            slot,
            symptoms: symptoms || null,
            documents: documents || [], // ✅ Store documents link

            appointmentType: appointmentType || "consultation",
            vaccines: vaccines || [],
            hospitalId: hospitalId || null,

            reminderAt, // ✅ ADD THIS

            status: "Booked",
            createdAt: new Date().toISOString(),
        };

        appointments.push(newAppointment);
        await writeDB(DB_FILE, appointments);

        // Send confirmation email
        if (patientId) {
            try {
                const patients = await readDB('patients.json');
                const patient = patients.find(p => p.id === patientId);

                if (patient && patient.email) {
                    const { sendEmail } = await import('@/lib/email');
                    await sendEmail({
                        to: patient.email,
                        subject: 'Appointment Confirmation - HealthConnect',
                        html: `
                            <h1>Appointment Confirmed</h1>
                            <p>Dear ${patient.name},</p>
                            <p>Your appointment has been successfully booked.</p>
                            <ul>
                                <li><strong>Doctor:</strong> ${doctorName} (${doctorType})</li>
                                <li><strong>Time:</strong> ${slot}</li>
                                <li><strong>Status:</strong> Confirmed</li>
                            </ul>
                            <p>Please arrive 10 minutes early.</p>
                        `
                    });
                }
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
                // Do not fail the request if email fails
            }
        }

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update appointment status
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Appointment ID and status are required' },
                { status: 400 }
            );
        }

        const appointments = await readDB(DB_FILE);
        const index = appointments.findIndex(a => a.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Update status
        appointments[index].status = status;

        // Optional: Add completedAt timestamp if status is 'Completed'
        if (status === 'Completed') {
            appointments[index].completedAt = new Date().toISOString();
        }

        await writeDB(DB_FILE, appointments);

        return NextResponse.json(appointments[index]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
