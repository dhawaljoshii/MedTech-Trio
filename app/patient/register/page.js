"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Icons
const UserPlusIcon = () => (
    <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);

const LoaderIcon = () => (
    <svg className="icon-md animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

function PatientRegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        mobile: "",
        email: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null);

    useEffect(() => {
        // Check for pending booking
        const stored = localStorage.getItem("pendingBooking");
        if (stored) {
            setPendingBooking(JSON.parse(stored));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!formData.name.trim() || !formData.mobile.trim()) {
            setError("Name and mobile number are required");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to register");
            }

            const patient = await response.json();

            // Store patient in localStorage
            localStorage.setItem("patient", JSON.stringify(patient));

            // Check if there's a pending booking to complete
            if (redirect === "booking" && pendingBooking) {
                localStorage.removeItem("pendingBooking");
                router.push(`/register?type=${pendingBooking.type}`);
            } else {
                // Redirect to chatbot
                router.push("/");
            }
        } catch (err) {
            setError("Failed to register. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <UserPlusIcon />
                    </div>
                    <h1>Patient Registration</h1>
                    <p>Please provide your details to continue</p>
                </div>

                {/* Pending booking notice */}
                {pendingBooking && (
                    <div className="alert alert-info">
                        <strong>Booking pending:</strong> {pendingBooking.doctor} at {pendingBooking.slot}
                    </div>
                )}

                {error && (
                    <div className="alert alert-error flex items-center gap-2">
                        <AlertCircleIcon />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter your age"
                            className="form-input"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mobile Number *</label>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Enter your mobile number"
                            className="form-input"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email (optional)"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        {isLoading ? (
                            <>
                                <LoaderIcon />
                                Registering...
                            </>
                        ) : (
                            <>
                                {pendingBooking ? "Register & Complete Booking" : "Continue to Chatbot"}
                                <ArrowRightIcon />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <a href="/">← Back to Chatbot</a>
                    <span style={{ margin: '0 12px', color: 'var(--neutral-300)' }}>|</span>
                    <a href="/doctor/login">Doctor Portal →</a>
                </div>
            </div>
        </div>
    );
}

export default function PatientRegister() {
    return (
        <Suspense fallback={
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="empty-state">
                        <LoaderIcon />
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <PatientRegisterContent />
        </Suspense>
    );
}
