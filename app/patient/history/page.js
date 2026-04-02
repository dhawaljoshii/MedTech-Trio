"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Icons
const ArrowLeftIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
    </svg>
);

const MenuIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const MessageIcon = () => (
    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const UserIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ClockIcon = () => (
    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const FileIcon = () => (
    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const LoaderIcon = () => (
    <svg className="icon-md animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const PillIcon = () => (
    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
    </svg>
);


export default function PatientHistory() {
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedPatient = localStorage.getItem("patient");
        if (!storedPatient) {
            router.push("/patient/register");
            return;
        }

        const patientData = JSON.parse(storedPatient);
        setPatient(patientData);

        const fetchData = async () => {
            try {
                // Fetch real data (Assuming API returns robust data, otherwise fallback)
                let chats = [];
                let appointments = [];
                let prescriptions = [];

                try {
                    const [chatsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
                        fetch(`/api/chats?patientId=${patientData.id}`),
                        fetch(`/api/appointments?patientId=${patientData.id}`),
                        fetch(`/api/prescriptions?patientId=${patientData.id}`)
                    ]);
                    if (chatsRes.ok) chats = await chatsRes.json();
                    if (appointmentsRes.ok) appointments = await appointmentsRes.json();
                    if (prescriptionsRes.ok) prescriptions = await prescriptionsRes.json();
                } catch (e) {
                    console.warn("API fetch failed, using mock data", e);
                }

                // Inject Mock Data if specific lists are empty
                if (appointments.length === 0) {
                    appointments = [
                        {
                            id: 'apt-1',
                            type: 'appointment',
                            doctorName: 'Dr. Sarah Wilson',
                            doctorType: 'Cardiologist',
                            status: 'Booked',
                            slot: '10:00 AM',
                            symptoms: 'Chest pain, mild palpitations',
                            createdAt: new Date(Date.now() + 86400000).toISOString(),
                            documents: []
                        },
                        {
                            id: 'apt-2',
                            type: 'appointment',
                            doctorName: 'Dr. James Chen',
                            doctorType: 'Dermatologist',
                            status: 'Completed',
                            slot: '2:30 PM',
                            symptoms: 'Rash on arm',
                            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                            documents: [
                                { name: 'skin_photo.jpg', type: 'image', url: '#' },
                                { name: 'lab_results.pdf', type: 'pdf', url: '#' }
                            ]
                        }
                    ];
                }

                if (chats.length === 0) {
                    chats = [
                        {
                            id: 'chat-1',
                            type: 'consultation',
                            doctorType: 'Cardiologist',
                            symptoms: 'Experiencing chest tightness after running',
                            createdAt: new Date(Date.now()).toISOString(),
                            summary: 'Recommended seeing a cardiologist due to exertion-related symptoms.',
                            messages: [
                                { sender: 'user', text: 'I have been feeling chest tightness after running.' },
                                { sender: 'bot', text: 'I understand. Can you describe the pain? Is it sharp or dull?' },
                                { sender: 'user', text: 'It is a dull ache, mostly on the left side.' },
                                { sender: 'bot', text: 'Given your symptoms, I recommend seeing a Cardiologist to rule out any underlying issues.' }
                            ],
                            documents: []
                        },
                        {
                            id: 'chat-2',
                            type: 'consultation',
                            doctorType: 'Dermatologist',
                            symptoms: 'Red itchy patch on forearm',
                            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
                            summary: 'Likely contact dermatitis. Recommended moisturizing and booking an appointment if it persists.',
                            messages: [
                                { sender: 'user', text: 'I have this red itchy patch on my arm.' },
                                { sender: 'bot', text: 'How long have you had it? Does it burn?' },
                                { sender: 'user', text: 'About 2 days. No burning, just itching.' },
                                { sender: 'bot', text: 'It looks like it could be contact dermatitis. Try keeping it moisturized. If it persists, see a Dermatologist.' }
                            ],
                            documents: [
                                { name: 'arm_rash_initial.jpg', type: 'image', url: '#' }
                            ]
                        }
                    ];
                }

                // Combine and format data
                const combined = [
                    ...appointments.map(a => ({ ...a, type: 'appointment', date: new Date(a.createdAt) })),
                    ...chats.map(c => ({ ...c, type: 'consultation', date: new Date(c.createdAt) })),
                    ...prescriptions.map(p => ({ ...p, type: 'prescription', date: new Date(p.createdAt) }))
                ].sort((a, b) => b.date - a.date);

                setHistoryItems(combined);
                if (combined.length > 0) {
                    setSelectedId(combined[0].id || (combined[0].type === 'appointment' ? combined[0]._id : combined[0].chatId));
                }

            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        if (filter === "all") return historyItems;
        return historyItems.filter(item => item.type === filter);
    }, [historyItems, filter]);

    const selectedItem = useMemo(() => {
        if (!selectedId) return null;
        return historyItems.find(item =>
            item.id === selectedId || item._id === selectedId || item.chatId === selectedId
        );
    }, [historyItems, selectedId]);

    const handleSelect = (item) => {
        setSelectedId(item.id || item._id || item.chatId);
        setMobileMenuOpen(false);
    };

    const formatDate = (dateObj) => {
        return new Date(dateObj).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const formatTime = (dateObj) => {
        return new Date(dateObj).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="auth-wrapper">
                <LoaderIcon />
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-tertiary)', minHeight: '100vh', padding: '24px 0' }}>
            <div className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />

            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
            </button>

            <div className="history-layout">
                {/* Sidebar */}
                <div className={`history-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <div className="user-info">
                            <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                                <UserIcon />
                            </div>
                            <div className="user-details">
                                <h1 style={{ fontSize: '16px' }}>{patient?.name || 'Patient'}</h1>
                                <p style={{ fontSize: '12px' }}>History Explorer</p>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-filters">
                        <button
                            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-chip ${filter === 'appointment' ? 'active' : ''}`}
                            onClick={() => setFilter('appointment')}
                        >
                            Appointments
                        </button>
                        <button
                            className={`filter-chip ${filter === 'consultation' ? 'active' : ''}`}
                            onClick={() => setFilter('consultation')}
                        >
                            Consultations
                        </button>
                        <button
                            className={`filter-chip ${filter === 'prescription' ? 'active' : ''}`}
                            onClick={() => setFilter('prescription')}
                        >
                            Prescriptions
                        </button>
                    </div>

                    <div className="sidebar-list">
                        {filteredItems.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-500)' }}>
                                <p style={{ fontSize: '14px' }}>No items found</p>
                            </div>
                        ) : (
                            filteredItems.map((item, i) => {
                                const id = item.id || item._id || item.chatId;
                                const isActive = id === selectedId;
                                return (
                                    <div
                                        key={i}
                                        className={`sidebar-item ${isActive ? 'active' : ''}`}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <div className="item-header">
                                            <span className="item-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {item.type === 'appointment' ? item.doctorName : `${item.doctorType} Consult`}
                                                {item.status === 'Completed' && <span style={{ fontSize: '12px' }} title="Completed">✅</span>}
                                            </span>
                                            <span className="item-date">{formatDate(item.date)}</span>
                                        </div>
                                        <div className="item-subtitle">
                                            {item.type === 'appointment' ? <CalendarIcon /> : item.type === 'prescription' ? <PillIcon /> : <MessageIcon />}
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                                {item.type === 'appointment' ? item.doctorType : item.type === 'prescription' ? item.diagnosis : item.symptoms}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)' }}>
                        <button onClick={() => router.push("/")} className="btn btn-secondary" style={{ width: '100%' }}>
                            <ArrowLeftIcon /> Back to Home
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="history-main">
                    {!selectedItem ? (
                        <div className="empty-state">
                            <p>Select an item from the sidebar to view details.</p>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <div className="detail-header">
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h1 style={{ fontSize: '24px', color: 'var(--primary-800)' }}>
                                            {selectedItem.type === 'appointment' ? 'Appointment Details' : selectedItem.type === 'prescription' ? 'Medical Prescription' : 'Consultation Summary'}
                                        </h1>
                                        {selectedItem.type === 'appointment' && (
                                            <span className={`detail-status status-${selectedItem.status.toLowerCase()}`}>
                                                {selectedItem.status}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <ClockIcon />
                                        {formatDate(selectedItem.date)} at {formatTime(selectedItem.date)}
                                    </p>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Overview</h3>
                                <div className="detail-card">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                        <div>
                                            <p className="form-label">{selectedItem.type === 'appointment' ? 'Doctor' : selectedItem.type === 'prescription' ? 'Prescribing Doctor' : 'Specialist Type'}</p>
                                            <p style={{ fontSize: '16px', fontWeight: '500' }}>
                                                {selectedItem.type === 'appointment' ? selectedItem.doctorName : selectedItem.type === 'prescription' ? selectedItem.doctorName : selectedItem.doctorType}
                                            </p>
                                        </div>
                                        {selectedItem.type === 'appointment' && (
                                            <div>
                                                <p className="form-label">Specialization</p>
                                                <p>{selectedItem.doctorType}</p>
                                            </div>
                                        )}
                                        {selectedItem.slot && (
                                            <div>
                                                <p className="form-label">Time Slot</p>
                                                <p>{selectedItem.slot}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            {selectedItem.documents && selectedItem.documents.length > 0 && (
                                <div className="detail-section">
                                    <h3>Attached Documents</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                        {selectedItem.documents.map((doc, idx) => (
                                            <div key={idx} className="detail-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ padding: '8px', background: 'var(--primary-50)', borderRadius: '8px', color: 'var(--primary-600)' }}>
                                                    <FileIcon />
                                                </div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <p style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {doc.name}
                                                    </p>
                                                    <p style={{ fontSize: '11px', color: 'var(--neutral-500)', textTransform: 'uppercase' }}>
                                                        {doc.type}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="detail-section">
                                <h3>Medical Context</h3>
                                <div className="detail-card">
                                    <p className="form-label">{selectedItem.type === 'prescription' ? 'Diagnosis' : 'Reported Symptoms'}</p>
                                    <p style={{ marginBottom: '16px' }}>{selectedItem.diagnosis || selectedItem.symptoms || 'None recorded'}</p>

                                    {selectedItem.type === 'prescription' && (
                                        <>
                                            <p className="form-label">Medicines / Dosage</p>
                                            <div style={{
                                                padding: '16px',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-light)',
                                                fontFamily: 'monospace',
                                                fontSize: '14px',
                                                whiteSpace: 'pre-wrap',
                                                marginBottom: '16px'
                                            }}>
                                                {selectedItem.medicines}
                                            </div>
                                        </>
                                    )}

                                    {(selectedItem.type === 'consultation' || selectedItem.type === 'prescription') && selectedItem.notes && (
                                        <>
                                            <p className="form-label">Doctor's Notes</p>
                                            <p style={{ fontStyle: 'italic', color: 'var(--neutral-600)' }}>{selectedItem.notes}</p>
                                        </>
                                    )}

                                    {selectedItem.type === 'consultation' && selectedItem.summary && (
                                        <>
                                            <p className="form-label">AI Analysis / Notes</p>
                                            <p>{selectedItem.summary}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Chat Transcript Section */}
                            {selectedItem.type === 'consultation' && selectedItem.messages && selectedItem.messages.length > 0 && (
                                <div className="detail-section">
                                    <h3>Chat Transcript</h3>
                                    <div className="chat-messages" style={{ maxHeight: '400px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                                        {selectedItem.messages.map((msg, idx) => (
                                            <div key={idx} className={`chat-bubble-row ${msg.sender === 'user' ? 'align-right' : 'align-left'}`}>
                                                <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'appointment' && selectedItem.status === 'Completed' && (
                                <div className="detail-section">
                                    <h3>Post-Consultation</h3>
                                    <div className="detail-card" style={{ background: 'var(--success-50)', borderColor: 'var(--success-100)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ background: 'var(--success-100)', padding: '8px', borderRadius: '50%', color: 'var(--success-700)' }}>
                                                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, color: 'var(--success-800)' }}>Appointment Completed</h4>
                                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--success-700)' }}>This consultation is done. Check your prescriptions below.</p>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-primary"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            onClick={() => {
                                                setFilter('prescription');
                                                // Auto-select the most recent prescription for immediate analysis
                                                const recentRx = historyItems.find(i => i.type === 'prescription');
                                                if (recentRx) {
                                                    const rxId = recentRx.id || recentRx._id;
                                                    setSelectedId(rxId);
                                                    if (window.innerWidth < 768) setMobileMenuOpen(false); // Close menu on mobile
                                                }
                                            }}
                                        >
                                            <PillIcon />
                                            View Prescriptions
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'appointment' && selectedItem.status === 'Booked' && (
                                <div style={{ textAlign: 'right' }}>
                                    <button className="btn btn-danger" onClick={() => alert('Cancellation feature coming soon')}>
                                        Cancel Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
