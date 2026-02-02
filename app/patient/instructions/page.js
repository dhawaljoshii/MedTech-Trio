"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CareInstructions() {
    const router = useRouter();
    const [instructions, setInstructions] = useState([]);
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const storedPatient = localStorage.getItem("patient");
        if (!storedPatient) {
            router.push("/patient/register"); // or login
            return;
        }
        const p = JSON.parse(storedPatient);
        setPatient(p);

        const fetchData = async () => {
            try {
                const [instRes, followRes] = await Promise.all([
                    fetch(`/api/instructions?patientId=${p.id}`),
                    fetch(`/api/followups?patientId=${p.id}`)
                ]);

                const instData = await instRes.json();
                const followData = await followRes.json();

                setInstructions(instData || []);
                setFollowups(followData || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleTask = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        // Optimistic update
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

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container max-w-4xl mx-auto">

                {/* Header */}
                <div className="dashboard-card mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl text-teal-600">
                            📋
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Recovery & Care</h1>
                            <p className="text-teal-600 font-medium">Your personalized post-operative guide</p>
                        </div>
                    </div>
                    <button onClick={() => router.push("/patient/history")} className="btn btn-secondary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid gap-8">

                    {/* Daily Checklist Section */}
                    <div className="dashboard-card ring-1 ring-teal-900/5 shadow-lg">
                        <div className="dashboard-header mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">✅</span>
                                    <h2 className="text-xl font-bold text-gray-800">Daily Recovery Checklist</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Please complete these tasks daily to ensure a speedy recovery</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <span className="text-2xl font-bold text-teal-600">{followups.filter(f => f.status === 'completed').length}</span>
                                <span className="text-gray-400 text-sm"> / {followups.length} done</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {followups.length > 0 ? (
                                followups.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task)}
                                        className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${task.status === 'completed'
                                                ? "bg-green-50/50 border-green-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-teal-400 hover:shadow-md"
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${task.status === 'completed'
                                                ? "bg-green-500 border-green-500 text-white scale-110"
                                                : "border-gray-300 bg-white group-hover:border-teal-400"
                                            }`}>
                                            {task.status === 'completed' && (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium text-lg transition-all ${task.status === 'completed'
                                                    ? "text-gray-400 line-through decoration-green-500/30"
                                                    : "text-gray-800"
                                                }`}>
                                                {task.task}
                                            </p>
                                            {task.doctorName && (
                                                <p className="text-xs text-gray-400 mt-0.5">Assigned by {task.doctorName}</p>
                                            )}
                                        </div>
                                        {task.status === 'completed' && (
                                            <span className="hidden sm:inline-block text-xs font-bold text-green-700 bg-white px-3 py-1 rounded-full shadow-sm border border-green-100 animate-fadeIn">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400">No daily tasks assigned to you yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="dashboard-card">
                        <div className="dashboard-header mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">📢</span>
                                    <h2 className="text-xl font-bold text-gray-800">Doctor's Instructions</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Important regulations and warnings to remember</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {instructions.length > 0 ? (
                                instructions.map((inst) => (
                                    <div
                                        key={inst.id}
                                        className={`flex gap-4 p-5 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${inst.type === "warning"
                                                ? "bg-red-50/50 border-red-500 border-y-red-100 border-r-red-100"
                                                : "bg-blue-50/50 border-blue-500 border-y-blue-100 border-r-blue-100"
                                            }`}
                                    >
                                        <div className={`mt-1 text-2xl flex-shrink-0 ${inst.type === "warning" ? "grayscale-0" : ""}`}>
                                            {inst.type === "warning" ? "⚠️" : "ℹ️"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-bold uppercase tracking-wider text-sm ${inst.type === "warning" ? "text-red-700" : "text-blue-700"}`}>
                                                    {inst.type}
                                                </h3>
                                                <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded border border-gray-100">
                                                    {new Date(inst.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-base leading-relaxed ${inst.type === "warning" ? "text-red-900 font-medium" : "text-blue-900"}`}>
                                                {inst.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400">No instructions from your doctor yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
