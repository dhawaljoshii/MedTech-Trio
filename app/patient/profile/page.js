"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icons
const UserIcon = () => (
    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
    </svg>
);

const EditIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
);

const HeartPulseIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
);

const LogOutIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const LoaderIcon = () => (
    <svg className="icon-md animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const CheckIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function MyProfile() {
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedPatient = localStorage.getItem("patient");
        if (storedPatient) {
            const patientData = JSON.parse(storedPatient);
            setPatient(patientData);
            setEditData(patientData);
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("patient");
        router.push("/");
    };

    const handleEditChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // Update patient in localStorage
            localStorage.setItem("patient", JSON.stringify(editData));
            setPatient(editData);
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditData(patient);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="empty-state">
                        <LoaderIcon />
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <UserIcon />
                        </div>
                        <h1>Not Logged In</h1>
                        <p>Please register or login to view your profile</p>
                    </div>

                    <button
                        onClick={() => router.push("/patient/register")}
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '12px' }}
                    >
                        Register / Login
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                    >
                        <ArrowLeftIcon />
                        Back to Chatbot
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <button onClick={() => router.push("/")} className="profile-back-btn">
                        <ArrowLeftIcon />
                        <span>Back</span>
                    </button>
                    <h1>My Profile</h1>
                    <div style={{ width: '80px' }}></div>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                    <div className="profile-success-alert">
                        <CheckIcon />
                        Profile updated successfully!
                    </div>
                )}

                {/* Profile Card */}
                <div className="profile-card">
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {patient.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-name-section">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    className="form-input profile-name-input"
                                    placeholder="Your name"
                                />
                            ) : (
                                <h2 className="profile-name">{patient.name}</h2>
                            )}
                            <span className="profile-status">
                                <span className="status-dot"></span>
                                Active Patient
                            </span>
                        </div>
                        {!isEditing && (
                            <button
                                className="profile-edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <EditIcon />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="profile-divider"></div>

                    {/* Info Section */}
                    <div className="profile-info-section">
                        <h3 className="profile-section-title">Personal Information</h3>

                        <div className="profile-info-grid">
                            {/* Age */}
                            <div className="profile-info-item">
                                <div className="profile-info-icon">
                                    <CalendarIcon />
                                </div>
                                <div className="profile-info-content">
                                    <span className="profile-info-label">Age</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={editData.age || ""}
                                            onChange={handleEditChange}
                                            className="form-input profile-info-input"
                                            placeholder="Your age"
                                        />
                                    ) : (
                                        <span className="profile-info-value">
                                            {patient.age ? `${patient.age} years` : "Not specified"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="profile-info-item">
                                <div className="profile-info-icon">
                                    <PhoneIcon />
                                </div>
                                <div className="profile-info-content">
                                    <span className="profile-info-label">Mobile</span>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={editData.mobile || ""}
                                            onChange={handleEditChange}
                                            className="form-input profile-info-input"
                                            placeholder="Your mobile number"
                                        />
                                    ) : (
                                        <span className="profile-info-value">
                                            {patient.mobile || "Not specified"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="profile-info-item">
                                <div className="profile-info-icon">
                                    <MailIcon />
                                </div>
                                <div className="profile-info-content">
                                    <span className="profile-info-label">Email</span>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email || ""}
                                            onChange={handleEditChange}
                                            className="form-input profile-info-input"
                                            placeholder="Your email address"
                                        />
                                    ) : (
                                        <span className="profile-info-value">
                                            {patient.email || "Not specified"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Patient ID */}
                            <div className="profile-info-item">
                                <div className="profile-info-icon">
                                    <HeartPulseIcon />
                                </div>
                                <div className="profile-info-content">
                                    <span className="profile-info-label">Patient ID</span>
                                    <span className="profile-info-value profile-id">
                                        {patient.id || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Actions */}
                    {isEditing && (
                        <div className="profile-edit-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSaveProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <LoaderIcon />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="profile-actions-card">
                    <h3 className="profile-section-title">Quick Actions</h3>
                    <div className="profile-actions-grid">
                        <button
                            className="profile-action-btn"
                            onClick={() => router.push("/patient/history")}
                        >
                            <span className="profile-action-icon history">📋</span>
                            <span>View History</span>
                        </button>
                        <button
                            className="profile-action-btn"
                            onClick={() => router.push("/patient/monitor")}
                        >
                            <span className="profile-action-icon monitor">📊</span>
                            <span>Health Monitor</span>
                        </button>
                        <button
                            className="profile-action-btn logout"
                            onClick={handleLogout}
                        >
                            <LogOutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="profile-footer">
                    <p>HealthConnect © 2024</p>
                </div>
            </div>
        </div>
    );
}
