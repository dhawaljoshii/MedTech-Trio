"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doctorAuth } from "@/data/doctorsAuth";

// Icons
const StethoscopeIcon = () => (
  <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const LockIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="icon-md animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function DoctorLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    await new Promise(resolve => setTimeout(resolve, 400));

    const doctor = doctorAuth.find(
      (d) => d.username === username && d.password === password
    );

    if (!doctor) {
      setError("Invalid credentials. Please check your username and password.");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("doctor", JSON.stringify(doctor));
    router.push("/doctor/dashboard");
  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleLogin();
  }
};


  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <StethoscopeIcon />
          </div>
          <h1>Doctor Portal</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error flex items-center gap-2">
            <AlertCircleIcon />
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Username</label>
         <input
  type="text"
  placeholder="Enter your username"
  className="form-input"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  onKeyDown={handleKeyDown}
/>

        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
  type="password"
  placeholder="Enter your password"
  className="form-input"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onKeyDown={handleKeyDown}
/>

        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px' }}
        >
          {isLoading ? (
            <>
              <LoaderIcon />
              Signing in...
            </>
          ) : (
            <>
              <LockIcon />
              Sign In
            </>
          )}
        </button>

        <div className="auth-footer">
          <a href="/">← Back to Patient Portal</a>
        </div>
      </div>
    </div>
  );
}