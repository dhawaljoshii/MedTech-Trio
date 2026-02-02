"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Calendar,
  Search,
  X,
  RefreshCw,
  LogOut,
  Users,
  Clock,
  AlertTriangle,
  Filter,
  Activity,
  Stethoscope,
  FileText,
  Syringe,
  User,
  CalendarDays,
  TrendingUp
} from "lucide-react";

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState("list");

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    patientName: "",
    urgency: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchAppointments = async (doctorName) => {
    try {
      const response = await fetch(
        `/api/appointments?doctor=${encodeURIComponent(doctorName)}`
      );
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (!storedDoctor) {
      router.push("/doctor/login");
      return;
    }

    const doctorData = JSON.parse(storedDoctor);
    setDoctor(doctorData);

    localStorage.setItem("currentDoctorType", doctorData.type || "general");

    fetchAppointments(doctorData.name).finally(() => setIsLoading(false));
  }, [router]);

  const handleRefresh = () => {
    if (doctor) {
      setIsLoading(true);
      fetchAppointments(doctor.name).finally(() => setIsLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("currentDoctorType");
    router.push("/doctor/login");
  };

  const normalizeUrgency = (urgency) => {
    if (urgency === "emergency") return "emergency";
    if (urgency === "urgent") return "urgent";
    return "routine";
  };

  const parseAppointmentDate = (slot) => {
    if (!slot) return null;
    const parts = slot.split("|");
    if (parts.length > 1) {
      const dateStr = parts[0].trim();
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return null;
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (filters.patientName) {
        const searchTerm = filters.patientName.toLowerCase();
        if (!apt.patientName?.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      if (filters.urgency !== "all") {
        const aptUrgency = normalizeUrgency(apt.urgency);
        if (aptUrgency !== filters.urgency) {
          return false;
        }
      }

      if (filters.status !== "all") {
        if (apt.status?.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      const aptDate = parseAppointmentDate(apt.slot) || new Date(apt.createdAt);

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (aptDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (aptDate > toDate) {
          return false;
        }
      }

      if (selectedDate) {
        const selectedStart = new Date(selectedDate);
        selectedStart.setHours(0, 0, 0, 0);
        const selectedEnd = new Date(selectedDate);
        selectedEnd.setHours(23, 59, 59, 999);

        if (aptDate < selectedStart || aptDate > selectedEnd) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, filters, selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter((apt) => {
      const aptDate = parseAppointmentDate(apt.slot) || new Date(apt.createdAt);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isSelectedDate = (date) => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const handleDateClick = (date) => {
    if (isSelectedDate(date)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const clearFilters = () => {
    setFilters({
      patientName: "",
      urgency: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
    setSelectedDate(null);
  };

  const hasActiveFilters =
    filters.patientName ||
    filters.urgency !== "all" ||
    filters.status !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    selectedDate;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const urgentAppointments = appointments.filter(
    (a) => normalizeUrgency(a.urgency) === "urgent"
  ).length;

  const emergencyAppointments = appointments.filter(
    (a) => normalizeUrgency(a.urgency) === "emergency"
  ).length;

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = parseAppointmentDate(apt.slot) || new Date(apt.createdAt);
    return isToday(aptDate);
  }).length;

  if (isLoading) {
    return (
      <div className="doc-dashboard">
        <div className="doc-loading">
          <div className="doc-loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="doc-dashboard">
      {/* Sidebar */}
      <aside className="doc-sidebar">
        <div className="doc-sidebar-header">
          <div className="doc-brand">
            <div className="doc-brand-icon">
              <Stethoscope size={24} />
            </div>
            <div className="doc-brand-text">
              <span className="doc-brand-name">HealthConnect</span>
              <span className="doc-brand-subtitle">Doctor Portal</span>
            </div>
          </div>
        </div>

        <div className="doc-profile">
          <div className="doc-avatar">
            <span>{doctor.name.charAt(0)}</span>
            <div className="doc-avatar-status"></div>
          </div>
          <div className="doc-profile-info">
            <h3>{doctor.name}</h3>
            <p>{doctor.type || "General"} Specialist</p>
          </div>
        </div>

        <nav className="doc-nav">
          <a href="#" className="doc-nav-item active">
            <Activity size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="doc-nav-item" onClick={() => router.push("/doctor/dashboard/chronic")}>
            <TrendingUp size={20} />
            <span>Chronic Monitoring</span>
          </a>
        </nav>

        <div className="doc-sidebar-footer">
          <button className="doc-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="doc-main">
        {/* Top Bar */}
        <header className="doc-topbar">
          <div className="doc-topbar-left">
            <h1>Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, Dr. {doctor.name.split(" ").pop()}</h1>
            <p>Here's your patient overview for today</p>
          </div>
          <div className="doc-topbar-right">
            <button className="doc-icon-btn" onClick={handleRefresh} title="Refresh">
              <RefreshCw size={20} />
            </button>
            <button
              className={`doc-icon-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle Filters"
            >
              <Filter size={20} />
              {hasActiveFilters && <span className="doc-badge-dot"></span>}
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="doc-stats">
          <div className="doc-stat-card doc-stat-total">
            <div className="doc-stat-icon">
              <Users size={24} />
            </div>
            <div className="doc-stat-content">
              <span className="doc-stat-value">{appointments.length}</span>
              <span className="doc-stat-label">Total Patients</span>
            </div>
          </div>

          <div className="doc-stat-card doc-stat-today">
            <div className="doc-stat-icon">
              <CalendarDays size={24} />
            </div>
            <div className="doc-stat-content">
              <span className="doc-stat-value">{todayAppointments}</span>
              <span className="doc-stat-label">Today's Schedule</span>
            </div>
          </div>

          <div className="doc-stat-card doc-stat-urgent">
            <div className="doc-stat-icon">
              <Clock size={24} />
            </div>
            <div className="doc-stat-content">
              <span className="doc-stat-value">{urgentAppointments}</span>
              <span className="doc-stat-label">Urgent Cases</span>
            </div>
          </div>

          <div className="doc-stat-card doc-stat-emergency">
            <div className="doc-stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="doc-stat-content">
              <span className="doc-stat-value">{emergencyAppointments}</span>
              <span className="doc-stat-label">Emergencies</span>
            </div>
          </div>
        </section>

        {/* Filter Panel */}
        {showFilters && (
          <section className="doc-filter-panel">
            <div className="doc-filter-grid">
              <div className="doc-filter-item doc-filter-search">
                <label>
                  <Search size={16} />
                  Search Patient
                </label>
                <input
                  type="text"
                  placeholder="Type patient name..."
                  value={filters.patientName}
                  onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                />
              </div>

              <div className="doc-filter-item">
                <label>Urgency Level</label>
                <select
                  value={filters.urgency}
                  onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                >
                  <option value="all">All Levels</option>
                  <option value="emergency">🚨 Emergency</option>
                  <option value="urgent">⚠️ Urgent</option>
                  <option value="routine">✅ Routine</option>
                </select>
              </div>

              <div className="doc-filter-item">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="doc-filter-item">
                <label>From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div className="doc-filter-item">
                <label>To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>

              {hasActiveFilters && (
                <button className="doc-clear-btn" onClick={clearFilters}>
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
          </section>
        )}

        {/* Content Area */}
        <section className="doc-content">
          {/* View Toggle & Title */}
          <div className="doc-content-header">
            <div className="doc-content-title">
              <h2>
                {viewMode === "calendar" ? "Appointment Calendar" : "Patient Appointments"}
              </h2>
              <span className="doc-result-count">
                {filteredAppointments.length} {filteredAppointments.length === 1 ? "patient" : "patients"}
              </span>
            </div>

            <div className="doc-view-toggle">
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
                List
              </button>
              <button
                className={viewMode === "calendar" ? "active" : ""}
                onClick={() => setViewMode("calendar")}
              >
                <Calendar size={18} />
                Calendar
              </button>
            </div>
          </div>

          {/* Selected Date Indicator */}
          {selectedDate && (
            <div className="doc-date-indicator">
              <CalendarDays size={18} />
              <span>
                Showing appointments for{" "}
                <strong>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </span>
              <button onClick={() => setSelectedDate(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="doc-calendar">
              <div className="doc-calendar-header">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                  <ChevronLeft size={20} />
                </button>
                <h3>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="doc-calendar-weekdays">
                {weekDays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="doc-calendar-grid">
                {getDaysInMonth(currentMonth).map((dayInfo, index) => {
                  const dayAppointments = getAppointmentsForDate(dayInfo.date);
                  const hasEmergency = dayAppointments.some((a) => normalizeUrgency(a.urgency) === "emergency");
                  const hasUrgent = dayAppointments.some((a) => normalizeUrgency(a.urgency) === "urgent");

                  return (
                    <div
                      key={index}
                      className={`doc-calendar-day 
                        ${!dayInfo.isCurrentMonth ? "other-month" : ""} 
                        ${isToday(dayInfo.date) ? "today" : ""} 
                        ${isSelectedDate(dayInfo.date) ? "selected" : ""}
                        ${hasEmergency ? "has-emergency" : hasUrgent ? "has-urgent" : ""}`}
                      onClick={() => handleDateClick(dayInfo.date)}
                    >
                      <span className="day-num">{dayInfo.date.getDate()}</span>
                      {dayAppointments.length > 0 && (
                        <span className="day-badge">{dayAppointments.length}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Appointments List */}
          <div className="doc-appointments">
            {filteredAppointments.length === 0 ? (
              <div className="doc-empty">
                <div className="doc-empty-icon">
                  <Users size={48} />
                </div>
                <h3>No Appointments Found</h3>
                <p>There are no appointments matching your current filters.</p>
                {hasActiveFilters && (
                  <button className="doc-btn-secondary" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`doc-appointment-card ${normalizeUrgency(apt.urgency)}`}
                >
                  <div className="doc-apt-left">
                    <div className="doc-apt-avatar">
                      <User size={24} />
                    </div>
                    <div className="doc-apt-info">
                      <h4>{apt.patientName}</h4>
                      <p className="doc-apt-symptoms">
                        {apt.symptoms || "Regular Checkup"}
                      </p>
                      <div className="doc-apt-meta">
                        <span className="doc-apt-time">
                          <Clock size={14} />
                          {apt.slot}
                        </span>
                        {apt.vaccines && apt.vaccines.length > 0 && (
                          <span className="doc-apt-tag vaccine">
                            <Syringe size={14} />
                            Vaccination
                          </span>
                        )}
                        {apt.documents && apt.documents.length > 0 && (
                          <span className="doc-apt-tag docs">
                            <FileText size={14} />
                            Documents
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="doc-apt-right">
                    <div className={`doc-apt-urgency ${normalizeUrgency(apt.urgency)}`}>
                      {normalizeUrgency(apt.urgency) === "emergency" && "🚨 Emergency"}
                      {normalizeUrgency(apt.urgency) === "urgent" && "⚠️ Urgent"}
                      {normalizeUrgency(apt.urgency) === "routine" && "✅ Routine"}
                    </div>
                    <span className={`doc-apt-status ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                    <button
                      className="doc-btn-primary"
                      onClick={() => router.push(`/doctor/patient/${apt.patientId}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
