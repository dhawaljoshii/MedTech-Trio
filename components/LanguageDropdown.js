"use client";

import { useState, useRef, useEffect } from "react";
import { EXTENDED_LANGUAGES } from "@/utils/languages_extended";

export default function LanguageDropdown({ onSelect, selectedLanguage }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter languages based on search term
    const filteredLanguages = EXTENDED_LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get selected language display
    const selectedLang = selectedLanguage
        ? EXTENDED_LANGUAGES.find(l => l.code === selectedLanguage)
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
            // Focus search input when dropdown opens
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
                    prev < filteredLanguages.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case "Enter":
                e.preventDefault();
                if (filteredLanguages[highlightedIndex]) {
                    handleSelect(filteredLanguages[highlightedIndex].code);
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

    const handleSelect = (code) => {
        onSelect(code);
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
                className="language-dropdown-trigger"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="language-dropdown-label">
                    {selectedLang ? (
                        <>
                            <span className="language-native">{selectedLang.name}</span>
                            <span className="language-english">({selectedLang.english})</span>
                        </>
                    ) : (
                        "Select Language"
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
                            placeholder="Search languages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="language-dropdown-list">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang, index) => (
                                <button
                                    key={lang.code}
                                    className={`language-dropdown-item ${index === highlightedIndex ? "highlighted" : ""
                                        } ${selectedLanguage === lang.code ? "selected" : ""}`}
                                    onClick={() => handleSelect(lang.code)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    role="option"
                                    aria-selected={selectedLanguage === lang.code}
                                >
                                    <span className="language-item-native">{lang.name}</span>
                                    <span className="language-item-english">{lang.english}</span>
                                </button>
                            ))
                        ) : (
                            <div className="language-dropdown-empty">No languages found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
