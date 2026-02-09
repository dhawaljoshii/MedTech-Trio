"use client";

import { useState, useEffect } from 'react';
import { getAllConsents } from '@/lib/consents';

export default function ConsentModal({ isOpen, onAccept, onCancel, userEmail }) {
    const [consents, setConsents] = useState([]);
    const [acceptedConsents, setAcceptedConsents] = useState({});
    const [signature, setSignature] = useState('');
    const [expandedConsent, setExpandedConsent] = useState(null);

    useEffect(() => {
        const allConsents = getAllConsents();
        setConsents(allConsents);

        // Initialize accepted state
        const initial = {};
        allConsents.forEach(consent => {
            initial[consent.id] = false;
        });
        setAcceptedConsents(initial);
    }, []);

    const handleCheckboxChange = (consentId) => {
        setAcceptedConsents(prev => ({
            ...prev,
            [consentId]: !prev[consentId]
        }));
    };

    const allRequiredAccepted = () => {
        return consents
            .filter(c => c.isRequired)
            .every(c => acceptedConsents[c.id]);
    };

    const canAccept = () => {
        return allRequiredAccepted() && signature.trim().length > 0;
    };

    const handleAccept = () => {
        const acceptedConsentsList = consents
            .filter(c => acceptedConsents[c.id])
            .map(c => ({
                consent_type_id: c.id,
                consent_name: c.name,
                version: c.version,
                accepted_at: new Date().toISOString()
            }));

        onAccept({
            patient_email: userEmail,
            consents: acceptedConsentsList,
            signature: signature,
            ip_address: 'client',
            user_agent: navigator.userAgent
        });
    };

    if (!isOpen || consents.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}>
                {/* Simple Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        margin: 0,
                        color: '#111827'
                    }}>
                        Terms & Consent
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '8px 0 0 0'
                    }}>
                        Please review and accept to continue
                    </p>
                </div>

                {/* Scrollable Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px 32px'
                }}>
                    {/* Consent List */}
                    {consents.map((consent) => (
                        <div key={consent.id} style={{
                            marginBottom: '20px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            {/* Consent Header with Checkbox */}
                            <div style={{
                                padding: '16px',
                                background: acceptedConsents[consent.id] ? '#f0fdf4' : '#fafafa',
                                borderBottom: expandedConsent === consent.id ? '1px solid #e5e7eb' : 'none'
                            }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={acceptedConsents[consent.id] || false}
                                        onChange={() => handleCheckboxChange(consent.id)}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            marginTop: '2px',
                                            cursor: 'pointer',
                                            accentColor: '#0d9488'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            color: '#111827',
                                            marginBottom: '4px'
                                        }}>
                                            {consent.name}
                                            {consent.isRequired && (
                                                <span style={{
                                                    color: '#dc2626',
                                                    marginLeft: '6px',
                                                    fontSize: '13px'
                                                }}>*</span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#6b7280',
                                            marginBottom: '8px'
                                        }}>
                                            {consent.description}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setExpandedConsent(expandedConsent === consent.id ? null : consent.id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#0d9488',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            {expandedConsent === consent.id ? '− Hide details' : '+ Read full text'}
                                        </button>
                                    </div>
                                </label>
                            </div>

                            {/* Expandable Content */}
                            {expandedConsent === consent.id && (
                                <div style={{
                                    padding: '16px',
                                    background: 'white',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    color: '#374151',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    <div dangerouslySetInnerHTML={{
                                        __html: consent.content.replace(/\n/g, '<br/>')
                                    }} />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Signature */}
                    <div style={{ marginTop: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '8px'
                        }}>
                            Digital Signature <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Type your full name"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontFamily: 'cursive',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '6px',
                            margin: '6px 0 0 0'
                        }}>
                            By signing, you agree to the terms above
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 32px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {consents.filter(c => c.isRequired && acceptedConsents[c.id]).length} of {consents.filter(c => c.isRequired).length} required
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: 'white',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={!canAccept()}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: canAccept() ? '#0d9488' : '#e5e7eb',
                                color: canAccept() ? 'white' : '#9ca3af',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: canAccept() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
