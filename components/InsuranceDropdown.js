"use client";

import { useState, useRef, useEffect } from "react";
import { INSURANCE_PROVIDERS } from "@/utils/insurance_providers";

export default function InsuranceDropdown({ onSelect, selectedProvider }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter providers based on search term
    const filteredProviders = INSURANCE_PROVIDERS.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get selected provider display
    const selectedProv = selectedProvider
        ? INSURANCE_PROVIDERS.find(p => p.id === selectedProvider || p.name === selectedProvider)
        : null;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            searchInputRef.current?.focus();
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredProviders.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case "Enter":
                e.preventDefault();
                if (filteredProviders[highlightedIndex]) {
                    handleSelect(filteredProviders[highlightedIndex].name);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm("");
                break;
        }
    };

    // Reset highlighted index when search changes
    useEffect(() => {
        setHighlightedIndex(0);
    }, [searchTerm]);

    const handleSelect = (providerName) => {
        onSelect(providerName);
        setIsOpen(false);
        setSearchTerm("");
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm("");
        }
    };

    return (
        <div className="language-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className="language-dropdown-trigger"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="language-dropdown-label">
                    {selectedProv ? (
                        <>
                            <span className="language-native">{selectedProv.name}</span>
                            <span className="language-english">({selectedProv.type})</span>
                        </>
                    ) : (
                        "Select Insurance Provider"
                    )}
                </span>
                <svg
                    className={`language-dropdown-arrow ${isOpen ? "open" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M6 8l4 4 4-4" />
                </svg>
            </button>

            {isOpen && (
                <div className="language-dropdown-menu" role="listbox">
                    <div className="language-dropdown-search">
                        <svg
                            className="language-search-icon"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="language-search-input"
                            placeholder="Search insurance providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="language-dropdown-list">
                        {filteredProviders.length > 0 ? (
                            filteredProviders.map((provider, index) => (
                                <button
                                    key={provider.id}
                                    type="button"
                                    className={`language-dropdown-item ${index === highlightedIndex ? "highlighted" : ""
                                        } ${selectedProvider === provider.name || selectedProvider === provider.id ? "selected" : ""}`}
                                    onClick={() => handleSelect(provider.name)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    role="option"
                                    aria-selected={selectedProvider === provider.name || selectedProvider === provider.id}
                                >
                                    <span className="language-item-native">{provider.name}</span>
                                    <span className="language-item-english">{provider.type}</span>
                                </button>
                            ))
                        ) : (
                            <div className="language-dropdown-empty">No insurance providers found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
