"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Icons
const ArrowLeftIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const LayoutDashboardIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const InboxIcon = () => (
  <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchAppointments();
  };

  const statusCounts = {
    total: appointments.length,
    booked: appointments.filter(a => a.status === 'Booked').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
  };

  if (isLoading) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <div className="empty-state">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-card">
          {/* Header */}
          <div className="dashboard-header">
            <div className="user-info">
              <div className="user-avatar" style={{ background: 'var(--neutral-100)', color: 'var(--neutral-600)' }}>
                <LayoutDashboardIcon />
              </div>
              <div className="user-details">
                <h1>Admin Dashboard</h1>
                <p>Manage appointments and overview</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleRefresh} className="btn btn-secondary">
                <RefreshIcon />
                Refresh
              </button>
              <button onClick={() => router.push("/")} className="btn btn-secondary">
                <ArrowLeftIcon />
                Back
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statusCounts.total}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{statusCounts.booked}</div>
              <div className="stat-label">Active Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--warning)' }}>{statusCounts.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Appointments Table */}
          <div>
            <div className="section-header">
              <ClipboardListIcon />
              <h2>All Appointments</h2>
            </div>

            {appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <InboxIcon />
                </div>
                <p>No appointments have been booked yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Specialty</th>
                      <th>Doctor</th>
                      <th>Time Slot</th>
                      <th>Symptoms</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a, i) => (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--bg-tertiary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--neutral-500)'
                            }}>
                              <UserIcon />
                            </div>
                            {a.patientName}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">{a.doctorType}</span>
                        </td>
                        <td className="font-medium">{a.doctorName}</td>
                        <td>{a.slot}</td>
                        <td className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.symptoms || '-'}
                        </td>
                        <td>
                          <span className={`badge ${a.status === 'Booked' ? 'badge-success' :
                            a.status === 'Completed' ? 'badge-warning' : 'badge-info'
                            }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}