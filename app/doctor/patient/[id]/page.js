"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

// Professional Icons (SVG)
const Icons = {
    Stethoscope: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>
    ),
    Calendar: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
    ),
    Education: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
    ),
    CheckCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
    Plus: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
    ),
    Trash: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
    ),
    Info: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12" y1="8" y2="8.01"></line></svg>
    ),
    Alert: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12" y1="17" y2="17.01"></line></svg>
    )
};

export default function PatientRecord() {
    const router = useRouter();
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState({ chats: [], appointments: [] });
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPrescribeModal, setShowPrescribeModal] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState("overview"); // overview | postop

    // Prescription Form State
    const [prescriptionForm, setPrescriptionForm] = useState({
        diagnosis: "",
        medicines: "",
        notes: ""
    });

    // Instructions State
    const [instructions, setInstructions] = useState([]);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const [instructionForm, setInstructionForm] = useState({
        type: "regulation", // regulation | warning
        content: ""
    });

    // Followup Checklist State
    const [followups, setFollowups] = useState([]);
    const [followupTask, setFollowupTask] = useState("");

    // Medical History State
    const [medicalHistory, setMedicalHistory] = useState({
        surgeries: [],
        chronicConditions: []
    });
    const [newSurgery, setNewSurgery] = useState({ name: "", type: "" });
    const [newCondition, setNewCondition] = useState(""); // diabetes | hypertension | asthma | other

    // Surgery Sub-tabs
    const [surgerySubTab, setSurgerySubTab] = useState("checklist"); // 'checklist' | 'preop'
    const [activeSurgeryId, setActiveSurgeryId] = useState(null);

    // AI Complication Detection State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [observations, setObservations] = useState("");

    // Complications State
    const [complications, setComplications] = useState([]);
    const [resolutionText, setResolutionText] = useState({}); // { complicationId: "text" }
    const [isResolving, setIsResolving] = useState(false);

    const detectComplications = async () => {
        setIsAnalyzing(true);
        setAiAnalysis(null);

        const patientContext = {
            surgeries: medicalHistory.surgeries,
            chronicConditions: medicalHistory.chronicConditions,
            totalTasks: followups.length,
            completedTasks: followups.filter(f => f.status === 'completed').length
        };

        try {
            const res = await fetch('/api/detect-complications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientContext, observations })
            });
            const data = await res.json();
            if (data.success) {
                setAiAnalysis(data);
            }
        } catch (error) {
            console.error("AI detection failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleHistoryUpdate = async (type, item, action) => {
        // type: 'surgeries' | 'chronicConditions'
        const updatedList = action === 'add'
            ? [...medicalHistory[type], item]
            : medicalHistory[type].filter(i => {
                if (type === 'surgeries' && typeof i === 'object') return i.name !== item.name;
                return i !== item;
            });

        const newHistory = { ...medicalHistory, [type]: updatedList };
        setMedicalHistory(newHistory);

        try {
            await fetch('/api/patients', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    medicalHistory: { [type]: updatedList }
                })
            });
        } catch (error) {
            console.error("Prescription error", error);
        }
    };

    const handleComplicationResolve = async (compId) => {
        const solution = resolutionText[compId];
        if (!solution) return;

        setIsResolving(true);
        try {
            const res = await fetch('/api/complications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: compId,
                    solution,
                    status: 'resolved'
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setComplications(prev => prev.map(c => c.id === compId ? updated : c));
                setResolutionText(prev => {
                    const next = { ...prev };
                    delete next[compId];
                    return next;
                });
            }
        } catch (error) {
            console.error("Resolution error", error);
        } finally {
            setIsResolving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Patient Details
                const patientRes = await fetch(`/api/patients?id=${id}`);
                const patientData = await patientRes.json();
                if (patientData.error) throw new Error(patientData.error);
                setPatient(patientData);

                // 2. Fetch History (Chats & Appointments)
                const [chatsRes, apptsRes, rxRes, instRes, followRes, compRes] = await Promise.all([
                    fetch(`/api/chats?patientId=${id}`),
                    fetch(`/api/appointments?patientId=${id}`),
                    fetch(`/api/prescriptions?patientId=${id}`),
                    fetch(`/api/instructions?patientId=${id}`),
                    fetch(`/api/followups?patientId=${id}`),
                    fetch(`/api/complications?patientId=${id}`)
                ]);

                const chats = await chatsRes.json();
                const appts = await apptsRes.json();
                const rxs = await rxRes.json();
                const insts = await instRes.json();
                const follows = await followRes.json();
                const comps = await compRes.json();

                setHistory({ chats, appointments: appts });
                setPrescriptions(rxs);
                setInstructions(insts || []);
                setFollowups(follows || []);
                setComplications(comps || []);

                // Initialize History if exists
                if (patientData.medicalHistory) {
                    const surgeries = patientData.medicalHistory.surgeries || [];
                    setMedicalHistory({
                        surgeries: surgeries,
                        chronicConditions: patientData.medicalHistory.chronicConditions || []
                    });

                    if (surgeries.length > 0) {
                        setActiveSurgeryId(surgeries[0].id || null);
                    }
                }

            } catch (error) {
                console.error("Error fetching patient data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        const doctor = JSON.parse(localStorage.getItem("doctor"));

        try {
            const res = await fetch('/api/prescriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: id,
                    patientName: patient.name,
                    doctorName: doctor.name,
                    doctorType: doctor.type,
                    ...prescriptionForm
                })
            });

            if (res.ok) {
                const newRx = await res.json();
                setPrescriptions(prev => [newRx, ...prev]);
                setShowPrescribeModal(false);
                setPrescriptionForm({ diagnosis: "", medicines: "", notes: "" });
                alert("Prescription added successfully!");
            }
        } catch (error) {
            alert("Failed to add prescription");
        }
    };

    const handleInstructionSubmit = async (e) => {
        e.preventDefault();
        const doctor = JSON.parse(localStorage.getItem("doctor"));

        try {
            const res = await fetch('/api/instructions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...instructionForm,
                    patientId: id,
                    surgeryId: activeSurgeryId
                })
            });
            const data = await res.json();
            setInstructions([data, ...instructions]);
            setShowInstructionModal(false);
            setInstructionForm({ type: "regulation", content: "" });
        } catch (error) {
            console.error("Failed to add instruction", error);
        }
    };

    const handleFollowupSubmit = async (e) => {
        e.preventDefault();
        if (!followupTask) return;

        try {
            const res = await fetch('/api/followups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: id,
                    task: followupTask,
                    surgeryId: activeSurgeryId
                })
            });
            const data = await res.json();
            setFollowups([data, ...followups]);
            setFollowupTask("");
        } catch (error) {
            console.error("Failed to add followup", error);
        }
    };

    const handleDeleteFollowup = async (taskId) => {
        try {
            const res = await fetch(`/api/followups?id=${taskId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setFollowups(followups.filter(f => f.id !== taskId));
            }
        } catch (error) {
            console.error("Failed to delete followup", error);
        }
    };

    const handleDeleteInstruction = async (instructionId) => {
        try {
            const res = await fetch(`/api/instructions?id=${instructionId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setInstructions(instructions.filter(i => i.id !== instructionId));
            }
        } catch (error) {
            console.error("Failed to delete instruction", error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Patient Record...</div>;
    if (!patient) return <div className="p-8 text-center">Patient not found</div>;

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container max-w-5xl mx-auto">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="btn-back mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="dashboard-card mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="user-info">
                        <div className="user-avatar text-2xl w-16 h-16 text-3xl">
                            {patient.name.charAt(0)}
                        </div>
                        <div className="user-details">
                            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                            <p className="text-teal-600 font-medium">
                                Patient ID: {patient.id} • {patient.age || 'N/A'} years • {patient.mobile}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setShowPrescribeModal(true); setActiveTab('prescriptions'); }}
                        className="btn btn-primary btn-pill px-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <Icons.Plus />
                        Add Note / Rx
                    </button>
                </div>

                {/* Tabs */}
                <div className="tab-container mb-8">
                    <button
                        className={`tab-pill ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Medical Overview
                    </button>
                    <button
                        className={`tab-pill ${activeTab === 'prescriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prescriptions')}
                    >
                        Prescriptions
                    </button>
                    <button
                        className={`tab-pill ${activeTab === 'surgery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('surgery')}
                    >
                        Surgery
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">

                        {/* LEFT COL: Appointments & Documents */}
                        <div className="space-y-8">

                            {/* Medical History Section (New) */}
                            <div className="dashboard-card border-l-4 border-l-purple-500">
                                <div className="section-header">
                                    <span className="section-icon">🏥</span>
                                    <h2>Medical History</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Chronic Conditions */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Chronic Conditions</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {medicalHistory.chronicConditions.map((cond, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                                                    {cond}
                                                    <button onClick={() => handleHistoryUpdate('chronicConditions', cond, 'remove')} className="hover:text-purple-900">×</button>
                                                </span>
                                            ))}
                                            {medicalHistory.chronicConditions.length === 0 && <span className="text-sm text-gray-400 italic">None logged</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                className="form-input py-1 text-sm"
                                                placeholder="Add condition..."
                                                value={newCondition}
                                                onChange={e => setNewCondition(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    if (newCondition) {
                                                        handleHistoryUpdate('chronicConditions', newCondition, 'add');
                                                        setNewCondition('');
                                                    }
                                                }}
                                            >
                                                <Icons.Plus />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* Booked Appointments */}
                            <div className="dashboard-card">
                                <div className="section-header">
                                    <span className="section-icon">📅</span>
                                    <h2>Booked Appointments</h2>
                                </div>
                                <div className="space-y-4">
                                    {history.appointments && history.appointments.length > 0 ? (
                                        history.appointments.map(appt => {
                                            // Simple urgency heuristic
                                            const isUrgent = appt.symptoms && (
                                                appt.symptoms.toLowerCase().includes('pain') ||
                                                appt.symptoms.toLowerCase().includes('emergency') ||
                                                appt.symptoms.toLowerCase().includes('severe')
                                            );

                                            return (
                                                <div key={appt.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-900">{appt.slot}</span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {isUrgent ? 'Urgent' : 'Routine'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            Doctor: <span className="font-medium text-gray-800">{appt.doctorName}</span>
                                                        </p>
                                                        {appt.symptoms && (
                                                            <p className="text-xs text-gray-400 mt-1 italic">"{appt.symptoms}"</p>
                                                        )}
                                                    </div>
                                                    <button className="btn btn-sm btn-secondary">
                                                        View Details
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-400 text-center text-sm py-4">No upcoming appointments.</p>
                                    )}
                                </div>
                            </div>

                            {/* Uploaded Documents Section */}
                            <div className="dashboard-card">
                                <div className="section-header">
                                    <span className="section-icon">📂</span>
                                    <h2>Uploaded Documents</h2>
                                </div>

                                {history.chats.filter(c => c.documents && c.documents.length > 0).length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-400">No documents uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {history.chats.flatMap(c => c.documents || []).map((doc, idx) => (
                                            <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-xl text-teal-600">
                                                    {doc.type === 'pdf' ? '📄' : '🖼️'}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-semibold text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                                                    <a href={doc.url} target="_blank" className="text-xs text-teal-600 font-medium hover:underline flex items-center gap-1">
                                                        View File <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COL: Symptoms */}
                        <div className="space-y-8">
                            {/* Symptoms History */}
                            <div className="dashboard-card">
                                <div className="section-header">
                                    <span className="section-icon">⚠️</span>
                                    <h2>Reported Symptoms</h2>
                                </div>

                                <div className="space-y-4">
                                    {history.chats
                                        .filter(c => c.symptoms && c.symptoms.length > 3 && !c.symptoms.toLowerCase().includes('null'))
                                        .map(chat => (
                                            <div key={chat.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-lg text-gray-800">{chat.symptoms}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-gray-600 border border-gray-100">
                                                            {new Date(chat.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-500 capitalize">{chat.doctorType} Consult</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    {history.chats.length === 0 && (
                                        <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-gray-400">No reported symptoms.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div className="animate-fadeIn">
                        <div className="dashboard-card">
                            <div className="section-header">
                                <span className="section-icon">💊</span>
                                <h2>Prescriptions</h2>
                            </div>

                            {prescriptions.length === 0 ? (
                                <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-sm">No active prescriptions.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {prescriptions.map(rx => (
                                        <div key={rx.id} className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 hover:border-teal-200 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-md tracking-wide">
                                                    {new Date(rx.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-teal-600 font-medium">
                                                    {rx.doctorName}
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Diagnosis</span>
                                                <p className="font-semibold text-gray-900">{rx.diagnosis}</p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Rx</span>
                                                <div className="text-sm text-gray-700 whitespace-pre-wrap font-medium mt-1">{rx.medicines}</div>
                                            </div>

                                            {rx.notes && (
                                                <div className="pt-3 border-t border-teal-100/50 mt-3">
                                                    <p className="text-xs text-gray-500 italic">Note: {rx.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'surgery' && (
                    <div className="animate-fadeIn space-y-8">

                        {/* 1. Surgery Management Section */}
                        <div className="dashboard-card">
                            <div className="section-header">
                                <span className="p-2 bg-teal-100 rounded-lg text-teal-600">
                                    <Icons.Stethoscope />
                                </span>
                                <h2>Surgery History</h2>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="space-y-3 mb-6">
                                    {medicalHistory.surgeries.length > 0 ? (
                                        medicalHistory.surgeries.map((surg, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-50/30 p-3 rounded-lg border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                                        <Icons.Stethoscope />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-800 text-sm block">
                                                            {typeof surg === 'string' ? surg : surg.name}
                                                        </span>
                                                        {typeof surg !== 'string' && surg.type && (
                                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium mt-0.5">
                                                                <Icons.Calendar />
                                                                {surg.type}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleHistoryUpdate('surgeries', surg, 'remove')}
                                                    className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Remove surgery"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 italic">No surgeries recorded in patient profile.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50/50 p-5 rounded-xl border border-dashed border-gray-200">
                                    <div className="flex-1 w-full space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Surgery Name</label>
                                        <input
                                            className="form-input w-full"
                                            placeholder="e.g. Appendectomy"
                                            value={newSurgery.name}
                                            onChange={e => setNewSurgery({ ...newSurgery, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1 w-full space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Details (Date/Type)</label>
                                        <input
                                            className="form-input w-full"
                                            placeholder="e.g. Jan 2024 • Robotic"
                                            value={newSurgery.type}
                                            onChange={e => setNewSurgery({ ...newSurgery, type: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (newSurgery.name) {
                                                handleHistoryUpdate('surgeries', newSurgery, 'add');
                                                setNewSurgery({ name: "", type: "" });
                                            }
                                        }}
                                        className="btn btn-primary h-[46px] px-6"
                                    >
                                        <Icons.Plus />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Care & Education Sub-Tabs */}
                        <div className="dashboard-card min-h-[500px]">
                            {/* Surgery Context Selector - Sleeker Version */}
                            <div className="surgery-pill-container" style={{ marginBottom: '32px', background: 'var(--neutral-50)', padding: '12px', border: '1px solid var(--border-light)' }}>
                                {medicalHistory.surgeries.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSurgeryId(s.id)}
                                        className={`clinical-pill-tab ${activeSurgeryId === s.id ? 'clinical-pill-tab-active' : ''}`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                                {medicalHistory.surgeries.length === 0 && (
                                    <span className="text-xs italic text-gray-400 py-2">Initialize surgery records to start monitoring...</span>
                                )}
                            </div>

                            {/* Clinical Alerts / Complications Section */}
                            {complications.filter(c => c.surgeryId === activeSurgeryId).length > 0 && (
                                <div className="mb-8 space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                        <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest">Active Safety Alerts</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {complications.filter(c => c.surgeryId === activeSurgeryId).map(comp => (
                                            <div key={comp.id} style={{
                                                padding: '24px',
                                                background: comp.status === 'resolved' ? 'rgba(13, 148, 136, 0.03)' : 'rgba(239, 68, 68, 0.03)',
                                                border: '1px solid',
                                                borderColor: comp.status === 'resolved' ? 'rgba(13, 148, 136, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                borderRadius: '20px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px'
                                            }}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${comp.status === 'resolved' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>
                                                                {comp.status}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold">{new Date(comp.reportedAt).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-800 leading-relaxed">{comp.description}</p>
                                                    </div>
                                                </div>

                                                {comp.status === 'pending' ? (
                                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                                        <textarea
                                                            placeholder="Provide clinical solution or guidance..."
                                                            className="form-input w-full min-h-[80px] text-sm"
                                                            value={resolutionText[comp.id] || ""}
                                                            onChange={(e) => setResolutionText({ ...resolutionText, [comp.id]: e.target.value })}
                                                        />
                                                        <button
                                                            className="btn btn-primary w-full py-2 flex items-center justify-center gap-2"
                                                            onClick={() => handleComplicationResolve(comp.id)}
                                                            disabled={isResolving || !resolutionText[comp.id]}
                                                        >
                                                            {isResolving ? "Updating..." : "Submit Solution & Resolve"}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Icons.CheckCircle />
                                                            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Resolved Solution</span>
                                                        </div>
                                                        <p className="text-sm text-teal-900 font-medium">{comp.solution}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="tab-container mb-6">
                                <button
                                    className={`tab-pill flex items-center gap-2 ${surgerySubTab === 'checklist' ? 'active' : ''}`}
                                    onClick={() => setSurgerySubTab('checklist')}
                                >
                                    <Icons.CheckCircle />
                                    Post-Surgery Followup
                                </button>
                                <button
                                    className={`tab-pill flex items-center gap-2 ${surgerySubTab === 'preop' ? 'active' : ''}`}
                                    onClick={() => setSurgerySubTab('preop')}
                                >
                                    <Icons.Education />
                                    Pre-Surgery Education
                                </button>
                            </div>

                            {surgerySubTab === 'checklist' && (
                                <div className="space-y-8 animate-fadeIn">
                                    {/* Recovery Tasks & Care Instructions - Two Column Layout */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                        {/* Recovery Checklist */}
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '24px',
                                            border: '2px solid #ccfbf1',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            transition: 'box-shadow 0.3s ease'
                                        }}>
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                                    <Icons.CheckCircle />
                                                </div>
                                                <div>
                                                    <h3 className="text-gray-800 font-bold text-lg">Daily Recovery Tasks</h3>
                                                    <span className="text-xs text-gray-500">Patient Ticklist</span>
                                                </div>
                                            </div>

                                            <form onSubmit={handleFollowupSubmit} className="flex gap-2 mb-6">
                                                <input
                                                    className="form-input flex-1"
                                                    placeholder="Enter recovery task (e.g. Walk 15 mins)"
                                                    value={followupTask}
                                                    onChange={(e) => setFollowupTask(e.target.value)}
                                                />
                                                <button type="submit" className="btn btn-primary px-4">
                                                    <Icons.Plus />
                                                </button>
                                            </form>

                                            <div className="space-y-3">
                                                {followups.filter(f => f.surgeryId === activeSurgeryId).map(task => (
                                                    <div key={task.id} className="flex items-center group gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-300">
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid',
                                                            borderColor: task.status === 'completed' ? 'var(--primary-500)' : 'var(--neutral-200)',
                                                            backgroundColor: task.status === 'completed' ? 'var(--primary-500)' : 'transparent',
                                                            color: 'white',
                                                            transition: 'all 0.3s'
                                                        }}>
                                                            {task.status === 'completed' && <Icons.Check size={14} />}
                                                        </div>
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            color: task.status === 'completed' ? 'var(--neutral-300)' : 'var(--neutral-700)',
                                                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                            transition: 'all 0.3s',
                                                            flex: 1
                                                        }}>{task.task}</span>
                                                        <button
                                                            onClick={() => handleDeleteFollowup(task.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
                                                            title="Delete task"
                                                        >
                                                            <Icons.Trash size={16} className="text-red-500" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {followups.filter(f => f.surgeryId === activeSurgeryId).length === 0 && (
                                                    <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        <Icons.CheckCircle className="mx-auto mb-3 text-gray-300 opacity-50" size={32} />
                                                        <p className="text-gray-400 text-sm font-medium">Clear recovery checklist.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Care Instructions */}
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '24px',
                                            border: '2px solid #dbeafe',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            transition: 'box-shadow 0.3s ease'
                                        }}>
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                        <Icons.Info />
                                                    </div>
                                                    <h3 className="text-gray-800 font-bold text-lg">Care Instructions</h3>
                                                </div>
                                                <button
                                                    onClick={() => setShowInstructionModal(true)}
                                                    className="btn btn-sm btn-soft flex items-center gap-1.5"
                                                >
                                                    <Icons.Plus />
                                                    Add Note
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {instructions.filter(i => !i.type.includes('pre') && i.surgeryId === activeSurgeryId).map(inst => (
                                                    <div key={inst.id} className="group" style={{
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        borderLeft: '4px solid',
                                                        borderLeftColor: inst.type === 'warning' ? '#f43f5e' : 'var(--primary-400)',
                                                        background: inst.type === 'warning' ? 'rgba(244, 63, 94, 0.05)' : 'rgba(13, 148, 136, 0.05)',
                                                        border: '1px solid',
                                                        borderColor: inst.type === 'warning' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(13, 148, 136, 0.1)',
                                                        transition: 'all 0.3s',
                                                        position: 'relative'
                                                    }}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span style={{
                                                                    fontSize: '10px',
                                                                    fontWeight: '900',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.1em',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '20px',
                                                                    background: inst.type === 'warning' ? '#fee2e2' : '#ccfbf1',
                                                                    color: inst.type === 'warning' ? '#991b1b' : '#0f766e'
                                                                }}>
                                                                    {inst.type}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-gray-400">{new Date(inst.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteInstruction(inst.id)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-red-50 rounded-lg"
                                                                title="Delete instruction"
                                                            >
                                                                <Icons.Trash size={14} className="text-red-500" />
                                                            </button>
                                                        </div>
                                                        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--neutral-700)', lineHeight: '1.6', margin: 0 }}>{inst.content}</p>
                                                    </div>
                                                ))}
                                                {instructions.filter(i => !i.type.includes('pre') && i.surgeryId === activeSurgeryId).length === 0 && (
                                                    <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                        <Icons.Education className="mx-auto mb-3 text-gray-300 opacity-50" size={32} />
                                                        <p className="text-gray-400 text-sm font-medium italic">No critical notes documented.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Risk Assessment Component - Full Width Section */}
                                    <div style={{
                                        background: 'linear-gradient(to bottom right, #eff6ff, #f5f3ff 50%, #faf5ff)',
                                        borderRadius: '16px',
                                        padding: '32px',
                                        border: '2px solid #c7d2fe',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                        marginTop: '24px'
                                    }}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                        <Icons.Alert />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900">AI Complication Risk Assessment</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl ml-15">
                                                    Enter clinician signals, patient complaints, or vital signs to trigger a deep-learning analysis of potential post-operative risks.
                                                </p>
                                            </div>
                                            <button
                                                className={`btn btn-primary btn-pill shadow-lg px-8 py-3 flex items-center gap-2 shrink-0 ${isAnalyzing ? 'pulse-primary' : ''}`}
                                                onClick={detectComplications}
                                                disabled={isAnalyzing}
                                            >
                                                {isAnalyzing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Analyzing Signals...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icons.Plus />
                                                        Detect Complications
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-3 block ml-1">Clinical Signals / Observations</label>
                                                <textarea
                                                    className="form-input min-h-[200px] text-sm leading-relaxed bg-white border-gray-200"
                                                    placeholder="e.g. Patient reports sharp pain in calf, mild fever (38.2C), redness around incision site..."
                                                    value={observations}
                                                    onChange={(e) => setObservations(e.target.value)}
                                                />
                                            </div>

                                            <div className="md:col-span-3">
                                                {aiAnalysis ? (
                                                    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full animate-fadeIn shadow-md">
                                                        <div className="flex justify-between items-center mb-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Risk Level:</span>
                                                                <span className={`risk-badge ${aiAnalysis.riskLevel === 'High' ? 'risk-badge-high' : aiAnalysis.riskLevel === 'Medium' ? 'risk-badge-medium' : 'risk-badge-low'
                                                                    }`}>
                                                                    {aiAnalysis.riskLevel}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] text-gray-400 font-medium">Analysis Time: {new Date().toLocaleTimeString()}</span>
                                                        </div>

                                                        <h4 className="font-bold text-gray-900 mb-4 text-lg">{aiAnalysis.summary}</h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                            <div>
                                                                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Findings</h5>
                                                                <div className="text-sm text-gray-700 leading-relaxed text-markdown" dangerouslySetInnerHTML={{ __html: aiAnalysis.details?.replace(/\n/g, '<br/>') }} />
                                                            </div>
                                                            <div>
                                                                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Next Steps</h5>
                                                                <div className="text-sm text-gray-700 leading-relaxed text-markdown space-y-2" dangerouslySetInnerHTML={{ __html: aiAnalysis.recommendations?.replace(/\n/g, '<br/>') }} />

                                                                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                                                                    <h5 className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                        <Icons.Info />
                                                                        Warning Signs
                                                                    </h5>
                                                                    <div className="text-xs text-orange-950 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: aiAnalysis.warningSigns?.replace(/\n/g, '<br/>') }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="border-2 border-dashed border-gray-200 rounded-xl h-full flex flex-col items-center justify-center p-10 text-center bg-white/50">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                                                            <Icons.Alert size={28} />
                                                        </div>
                                                        <h4 className="text-gray-600 font-bold mb-2">Waiting for Signals</h4>
                                                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                                            Provide clinician observations and click "Detect Complications" to generate an AI risk assessment.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {surgerySubTab === 'preop' && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-fadeIn">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-teal-50/30 p-6 rounded-2xl border border-teal-100/50">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-teal-900 mb-2 flex items-center gap-2">
                                                <Icons.Education />
                                                Pre-Surgery Education Module
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
                                                Provide educational materials, preparation PDFs, or specific pre-operative instructions to ensure a safe procedure.
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-pill shadow-lg px-6 shrink-0"
                                            onClick={() => setShowInstructionModal(true)}
                                        >
                                            <Icons.Plus />
                                            Add Pre-Op Material
                                        </button>
                                    </div>

                                    <div className="max-w-3xl space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Current Instructions</h4>
                                        {instructions.filter(i => (i.type.includes('pre') || i.content.toLowerCase().includes('before')) && i.surgeryId === activeSurgeryId).map(inst => (
                                            <div key={inst.id} className="bg-white p-5 rounded-xl border border-teal-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                                                <div className="mt-1 text-teal-500">
                                                    <Icons.CheckCircle />
                                                </div>
                                                <div>
                                                    <p className="text-teal-950 font-medium leading-relaxed">{inst.content}</p>
                                                    <span className="text-[10px] text-gray-400 font-medium mt-2 block">{new Date(inst.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {instructions.filter(i => (i.type.includes('pre') || i.content.toLowerCase().includes('before')) && i.surgeryId === activeSurgeryId).length === 0 && (
                                            <div className="text-center py-6 bg-white/50 rounded-xl border border-dashed border-teal-200">
                                                <p className="text-gray-400 text-sm italic">No pre-operative materials for this surgery.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
                }

                {/* Prescription Modal */}
                {
                    showPrescribeModal && (
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-100 transform transition-all">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">New Prescription</h2>
                                <form onSubmit={handlePrescriptionSubmit}>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Diagnosis (Optional for Notes)</label>
                                            <input
                                                className="form-input"
                                                value={prescriptionForm.diagnosis}
                                                onChange={e => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                                                placeholder="e.g. Viral Fever (or leave blank for general notes)"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Medicines (Rx) - Leave empty if just a note</label>
                                            <textarea
                                                className="form-input min-h-[120px]"
                                                value={prescriptionForm.medicines}
                                                onChange={e => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })}
                                                placeholder="e.g. Paracetamol 500mg - 1 tab after food (3 days)"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Clinical Notes</label>
                                            <textarea
                                                className="form-input"
                                                value={prescriptionForm.notes}
                                                onChange={e => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                                placeholder="Additional instructions or general observations..."
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Attachments</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setPrescriptionForm({
                                                                ...prescriptionForm,
                                                                attachments: [{
                                                                    name: file.name,
                                                                    type: file.type.includes('pdf') ? 'pdf' : 'image',
                                                                    url: '#'
                                                                }]
                                                            });
                                                        }
                                                    }}
                                                />
                                                {prescriptionForm.attachments && prescriptionForm.attachments.length > 0 ? (
                                                    <p className="text-sm text-teal-600 font-medium">
                                                        📎 {prescriptionForm.attachments[0].name}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Click to upload reports or files
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowPrescribeModal(false)}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Save Prescription
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Instruction Modal */}
                {
                    showInstructionModal && (
                        <div className="modal-overlay">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100" style={{ animation: 'modalSlideIn 0.3s ease' }}>
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Add Care Instruction</h2>
                                    <button onClick={() => setShowInstructionModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
                                </div>
                                <form onSubmit={handleInstructionSubmit}>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Type</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    type="button"
                                                    className={`p-3 rounded-lg border font-bold text-[10px] flex flex-col items-center gap-1.5 transition-all ${instructionForm.type === 'regulation'
                                                        ? 'bg-teal-50 border-teal-500 text-teal-700'
                                                        : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => setInstructionForm({ ...instructionForm, type: 'regulation' })}
                                                >
                                                    <Icons.Info />
                                                    REGULATION
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`p-3 rounded-lg border font-bold text-[10px] flex flex-col items-center gap-1.5 transition-all ${instructionForm.type === 'warning'
                                                        ? 'bg-red-50 border-red-500 text-red-700'
                                                        : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => setInstructionForm({ ...instructionForm, type: 'warning' })}
                                                >
                                                    <Icons.Alert />
                                                    WARNING
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`p-3 rounded-lg border font-bold text-[10px] flex flex-col items-center gap-1.5 transition-all ${instructionForm.type === 'pre-op'
                                                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                                                        : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => setInstructionForm({ ...instructionForm, type: 'pre-op' })}
                                                >
                                                    <Icons.Education />
                                                    PRE-OP
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Content</label>
                                            <textarea
                                                className="form-input min-h-[120px] text-sm leading-relaxed"
                                                value={instructionForm.content}
                                                onChange={e => setInstructionForm({ ...instructionForm, content: e.target.value })}
                                                placeholder="Enter fasting guidelines, arrival times, or required documents..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowInstructionModal(false)}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Add Instruction
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

            </div >
        </div >
    );
}
