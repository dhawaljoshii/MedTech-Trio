"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icons (SVG Components for reliability)
const HospitalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon">
        <path d="M18 22V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
        <path d="M2 22h20" />
        <path d="M14 22V10a2 2 0 0 0-2-2h-4v14" />
        <path d="M12 18h.01" />
    </svg>
);

export default function PatientSurgeryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("surgeries"); // 'surgeries' | 'preop' | 'postop'
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [instructions, setInstructions] = useState([]);
    const [followups, setFollowups] = useState([]);
    const [complications, setComplications] = useState([]);
    const [activeSurgeryId, setActiveSurgeryId] = useState(null);

    // Complication reporting state
    const [showComplicationModal, setShowComplicationModal] = useState(false);
    const [complicationDescription, setComplicationDescription] = useState("");
    const [submittingComplication, setSubmittingComplication] = useState(false);

    useEffect(() => {
        const storedPatient = localStorage.getItem("patient");
        if (!storedPatient) {
            router.push("/");
            return;
        }
        const p = JSON.parse(storedPatient);
        setPatient(p);

        const fetchData = async () => {
            try {
                const [instRes, followRes, patientRes, compRes] = await Promise.all([
                    fetch(`/api/instructions?patientId=${p.id}`),
                    fetch(`/api/followups?patientId=${p.id}`),
                    fetch(`/api/patients?id=${p.id}`),
                    fetch(`/api/complications?patientId=${p.id}`)
                ]);

                const instData = await instRes.json();
                const followData = await followRes.json();
                const patientData = await patientRes.json();
                const compData = await compRes.json();

                setInstructions(instData || []);
                setFollowups(followData || []);
                setComplications(compData || []);

                if (Array.isArray(patientData)) {
                    const updatedP = patientData.find(u => u.id === p.id);
                    if (updatedP) {
                        setPatient(updatedP);
                        if (updatedP.medicalHistory?.surgeries?.length > 0) {
                            setActiveSurgeryId(updatedP.medicalHistory.surgeries[0].id);
                        }
                    }
                } else if (patientData && patientData.medicalHistory) {
                    setPatient(patientData);
                    if (patientData.medicalHistory?.surgeries?.length > 0) {
                        setActiveSurgeryId(patientData.medicalHistory.surgeries[0].id);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const toggleTask = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        setFollowups(prev => prev.map(f => f.id === task.id ? { ...f, status: newStatus } : f));

        try {
            await fetch('/api/followups', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id, status: newStatus })
            });
        } catch (e) {
            console.error("Error updating task", e);
        }
    };

    const handleComplicationSubmit = async (e) => {
        e.preventDefault();
        if (!complicationDescription.trim()) return;

        setSubmittingComplication(true);
        try {
            const res = await fetch('/api/complications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: patient.id,
                    surgeryId: activeSurgeryId,
                    description: complicationDescription
                })
            });

            if (res.ok) {
                const newComp = await res.json();
                setComplications(prev => [...prev, newComp]);
                setComplicationDescription("");
                setShowComplicationModal(false);
            }
        } catch (error) {
            console.error("Error reporting complication:", error);
        } finally {
            setSubmittingComplication(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-100)', borderTopColor: 'var(--primary-600)', borderRadius: '50%' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">

                {/* Modern Surgery Context Header */}
                <div className="surgery-context-header">
                    <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
                                    <HospitalIcon />
                                </div>
                                <div style={{ height: '2px', width: '32px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px' }}></div>
                                <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.8 }}>Secure Surgery Centre</span>
                            </div>
                            <h1 style={{ color: 'white', fontSize: '30px', fontWeight: '700', margin: '0 0 8px 0' }}>Surgery Centre</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>Comprehensive history and personalized recovery tracks</p>

                            {patient?.medicalHistory?.surgeries?.length > 0 && (
                                <div className="surgery-pill-container" style={{ marginTop: '32px' }}>
                                    {patient.medicalHistory.surgeries.map(surg => (
                                        <button
                                            key={surg.id}
                                            onClick={() => setActiveSurgeryId(surg.id)}
                                            className={`surgery-pill ${activeSurgeryId === surg.id ? 'surgery-pill-active' : 'surgery-pill-inactive'}`}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeSurgeryId === surg.id ? 'var(--primary-600)' : 'rgba(255,255,255,0.4)' }}></span>
                                            {surg.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => router.push("/")}
                            className="btn btn-soft"
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                        >
                            <span>←</span> Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Sleeker Sub-Tabs Navigation */}
                <div className="subtab-nav">
                    {[
                        { id: 'surgeries', label: 'My Surgeries', icon: '😷' },
                        { id: 'preop', label: 'Pre-Op Guide', icon: '📚' },
                        { id: 'postop', label: 'Post-Op Recovery', icon: '⚡' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`subtab-pill ${activeTab === tab.id ? 'subtab-pill-active' : ''}`}
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

                    {/* 1. MY SURGERIES */}
                    {activeTab === 'surgeries' && (
                        <div className="medical-pro-card" style={{ padding: '36px' }}>
                            <div className="section-header">
                                <span style={{ fontSize: '20px' }}>😷</span>
                                <h2>Procedural History</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                                {patient?.medicalHistory?.surgeries && patient.medicalHistory.surgeries.length > 0 ? (
                                    patient.medicalHistory.surgeries.map((surg, i) => (
                                        <div key={i} className="appointment-card" style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div className="appointment-avatar">🔪</div>
                                                <div>
                                                    <h4 style={{ margin: 0 }}>{typeof surg === 'string' ? surg : surg.name}</h4>
                                                    {typeof surg !== 'string' && surg.type && (
                                                        <span className="stat-label" style={{ color: 'var(--primary-500)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                                                            {surg.type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state-pro">
                                        <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '24px' }}>📋</span>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '700', color: 'var(--neutral-800)' }}>No surgical history identified.</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--neutral-400)' }}>Contact your clinical team if this is an error.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. PRE-OP EDUCATION */}
                    {activeTab === 'preop' && (
                        <div className="medical-pro-card" style={{ padding: '36px' }}>
                            <div className="section-header">
                                <span style={{ fontSize: '20px' }}>📚</span>
                                <h2>Pre-Operative Preparation</h2>
                            </div>

                            <p style={{ marginBottom: '24px', fontSize: '14px' }}>Please follow these instructions carefully before your procedure.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {instructions.filter(i => (i.type === 'pre-op' || i.content.toLowerCase().includes('before')) && i.surgeryId === activeSurgeryId).length > 0 ? (
                                    instructions
                                        .filter(i => (i.type === 'pre-op' || i.content.toLowerCase().includes('before')) && i.surgeryId === activeSurgeryId)
                                        .map(inst => (
                                            <div key={inst.id} className="instruction-card-pro" style={{ borderLeft: '4px solid var(--warning)' }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <span style={{ fontSize: '24px' }}>☝️</span>
                                                    <div>
                                                        <strong style={{ display: 'block', textTransform: 'uppercase', fontSize: '11px', color: 'var(--warning)', letterSpacing: '0.5px', marginBottom: '8px' }}>Essential Instruction</strong>
                                                        <p style={{ margin: 0, fontWeight: '500', color: 'var(--neutral-800)', fontSize: '16px' }}>{inst.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="empty-state-pro">
                                        <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '24px' }}>📖</span>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '700', color: 'var(--neutral-800)' }}>No preparation guide available.</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--neutral-400)' }}>Please select an active surgery context above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. POST-OP RECOVERY */}
                    {activeTab === 'postop' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                            <div className="medical-pro-card" style={{ padding: '36px' }}>
                                <div className="section-header" style={{ marginBottom: '24px' }}>
                                    <span style={{ fontSize: '20px' }}>✅</span>
                                    <h2>Daily Recovery Checklist</h2>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {followups.filter(f => f.surgeryId === activeSurgeryId).length > 0 ? (
                                        followups.filter(f => f.surgeryId === activeSurgeryId).map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => toggleTask(task)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '16px',
                                                    background: task.status === 'completed' ? 'var(--primary-50)' : 'white',
                                                    border: '1px solid',
                                                    borderColor: task.status === 'completed' ? 'var(--primary-200)' : 'var(--border-light)',
                                                    borderRadius: '16px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: task.status === 'completed' ? 'none' : 'var(--shadow-sm)'
                                                }}
                                            >
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: '2px solid',
                                                    borderColor: task.status === 'completed' ? 'var(--success)' : 'var(--neutral-300)',
                                                    background: task.status === 'completed' ? 'var(--success)' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '14px'
                                                }}>
                                                    {task.status === 'completed' && "✓"}
                                                </div>
                                                <span style={{
                                                    fontWeight: '600',
                                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                    color: task.status === 'completed' ? 'var(--neutral-400)' : 'var(--neutral-800)',
                                                    fontSize: '14px'
                                                }}>
                                                    {task.task}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state-pro" style={{ padding: '32px' }}>
                                            <span style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}>✨</span>
                                            <p style={{ margin: 0, fontWeight: '600', color: 'var(--neutral-400)', fontSize: '14px' }}>All tasks completed or none assigned.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="medical-pro-card" style={{ padding: '36px' }}>
                                <div className="section-header" style={{ marginBottom: '24px' }}>
                                    <span style={{ fontSize: '20px' }}>📝</span>
                                    <h2>General Care Instructions</h2>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {instructions.filter(i => i.type !== 'pre-op' && !i.content.toLowerCase().includes('before') && i.surgeryId === activeSurgeryId).length > 0 ? (
                                        instructions
                                            .filter(i => i.type !== 'pre-op' && !i.content.toLowerCase().includes('before') && i.surgeryId === activeSurgeryId)
                                            .map(inst => (
                                                <div key={inst.id} className="instruction-card-pro" style={{
                                                    borderLeft: '4px solid',
                                                    borderLeftColor: inst.type === 'warning' ? 'var(--error)' : 'var(--primary-400)',
                                                    background: inst.type === 'warning' ? '#fff5f5' : 'white'
                                                }}>
                                                    <strong style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.6, letterSpacing: '0.5px' }}>
                                                        {inst.type === 'warning' ? '⚠️ Urgent Warning' : 'ℹ️ Recovery Note'}
                                                    </strong>
                                                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: inst.type === 'warning' ? '#991b1b' : 'var(--neutral-700)' }}>{inst.content}</p>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="empty-state-pro" style={{ padding: '32px' }}>
                                            <span style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}>ℹ️</span>
                                            <p style={{ margin: 0, fontWeight: '600', color: 'var(--neutral-400)', fontSize: '14px' }}>No care notes documentation for this procedure.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="medical-pro-card" style={{ padding: '36px', gridColumn: '1 / -1' }}>
                                <div className="section-header" style={{ marginBottom: '24px', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>⚠️</span>
                                        <h2>Reported Complications</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowComplicationModal(true)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            background: 'var(--error)',
                                            color: 'white',
                                            border: 'none',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                                        }}
                                    >
                                        Report Issue
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {complications.filter(c => c.surgeryId === activeSurgeryId).length > 0 ? (
                                        complications.filter(c => c.surgeryId === activeSurgeryId).map((comp) => (
                                            <div key={comp.id} style={{
                                                padding: '24px',
                                                background: comp.status === 'resolved' ? 'rgba(13, 148, 136, 0.05)' : '#fff5f5',
                                                border: '1px solid',
                                                borderColor: comp.status === 'resolved' ? 'var(--primary-200)' : '#feb2b2',
                                                borderRadius: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: '900',
                                                        textTransform: 'uppercase',
                                                        background: comp.status === 'resolved' ? 'var(--success)' : 'var(--error)',
                                                        color: 'white',
                                                        padding: '4px 12px',
                                                        borderRadius: '20px'
                                                    }}>
                                                        {comp.status}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: 'var(--neutral-400)', fontWeight: '600' }}>
                                                        {new Date(comp.reportedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--neutral-800)', lineHeight: '1.4' }}>
                                                    {comp.description}
                                                </p>

                                                {comp.solution ? (
                                                    <div style={{
                                                        marginTop: '8px',
                                                        background: 'white',
                                                        padding: '20px',
                                                        borderRadius: '20px',
                                                        border: '1px solid var(--primary-100)',
                                                        boxShadow: 'var(--shadow-sm)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>👨‍⚕️</div>
                                                            <strong style={{ fontSize: '11px', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clinical response</strong>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--neutral-700)', fontWeight: '500', lineHeight: '1.6' }}>
                                                            {comp.solution}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', textAlign: 'center' }}>
                                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--neutral-400)', fontWeight: '600' }}>Waiting for clinical review...</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state-pro" style={{ padding: '48px', gridColumn: '1 / -1' }}>
                                            <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
                                                <span style={{ fontSize: '24px' }}>🛡️</span>
                                            </div>
                                            <p style={{ margin: 0, fontWeight: '700', color: 'var(--neutral-800)' }}>High Safety Integrity</p>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--neutral-400)' }}>No complications reported for this procedure.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Complication Report Modal */}
                {showComplicationModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-[28px] p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-fadeIn">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-2xl">⚠️</span> Report Complication
                                </h2>
                                <button onClick={() => setShowComplicationModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">×</button>
                            </div>

                            <form onSubmit={handleComplicationSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">What are you experiencing?</label>
                                        <textarea
                                            className="form-input min-h-[160px] bg-gray-50/50 border-gray-100/80 rounded-[20px] text-sm leading-relaxed"
                                            placeholder="Please describe your symptoms, pain levels, or any unusual changes..."
                                            value={complicationDescription}
                                            onChange={(e) => setComplicationDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <p className="text-[11px] text-red-700 font-bold leading-relaxed">
                                            🚨 If you are experiencing a medical emergency (chest pain, severe bleeding, or difficulty breathing), call emergency services immediately.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowComplicationModal(false)}
                                            className="btn btn-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-danger flex-1 py-3 shadow-lg"
                                            disabled={submittingComplication}
                                        >
                                            {submittingComplication ? "Reporting..." : "Send to Doctor"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
