// Major insurance providers in India and internationally

export const INSURANCE_PROVIDERS = [
    // Top Indian Health Insurance Companies
    { id: "star-health", name: "Star Health Insurance", type: "Health" },
    { id: "icici-lombard", name: "ICICI Lombard Health Insurance", type: "Health" },
    { id: "hdfc-ergo", name: "HDFC ERGO Health Insurance", type: "Health" },
    { id: "care-health", name: "Care Health Insurance (Religare)", type: "Health" },
    { id: "niva-bupa", name: "Niva Bupa Health Insurance", type: "Health" },
    { id: "aditya-birla", name: "Aditya Birla Health Insurance", type: "Health" },
    { id: "max-bupa", name: "Max Bupa Health Insurance", type: "Health" },
    { id: "bajaj-allianz", name: "Bajaj Allianz General Insurance", type: "Health" },
    { id: "oriental-insurance", name: "Oriental Insurance Company", type: "Health" },
    { id: "national-insurance", name: "National Insurance Company", type: "Health" },
    { id: "new-india", name: "New India Assurance", type: "Health" },
    { id: "united-india", name: "United India Insurance", type: "Health" },
    { id: "royal-sundaram", name: "Royal Sundaram Health Insurance", type: "Health" },
    { id: "sbi-general", name: "SBI General Insurance", type: "Health" },
    { id: "reliance-general", name: "Reliance General Insurance", type: "Health" },
    { id: "future-generali", name: "Future Generali Health Insurance", type: "Health" },
    { id: "tata-aig", name: "Tata AIG General Insurance", type: "Health" },
    { id: "go-digit", name: "Go Digit General Insurance", type: "Health" },
    { id: "acko-general", name: "Acko General Insurance", type: "Health" },
    { id: "manipal-cigna", name: "Manipal Cigna Health Insurance", type: "Health" },

    // Government Health Insurance Schemes
    { id: "cghs", name: "CGHS (Central Government Health Scheme)", type: "Government" },
    { id: "esis", name: "ESIS (Employee State Insurance Scheme)", type: "Government" },
    { id: "ayushman-bharat", name: "Ayushman Bharat - PMJAY", type: "Government" },
    { id: "rsby", name: "RSBY (Rashtriya Swasthya Bima Yojana)", type: "Government" },

    // Life Insurance Companies (also offer health products)
    { id: "lic", name: "LIC (Life Insurance Corporation of India)", type: "Life & Health" },
    { id: "hdfc-life", name: "HDFC Life Insurance", type: "Life & Health" },
    { id: "icici-prudential", name: "ICICI Prudential Life Insurance", type: "Life & Health" },
    { id: "sbi-life", name: "SBI Life Insurance", type: "Life & Health" },
    { id: "max-life", name: "Max Life Insurance", type: "Life & Health" },
    { id: "bajaj-life", name: "Bajaj Allianz Life Insurance", type: "Life & Health" },
    { id: "tata-aia", name: "Tata AIA Life Insurance", type: "Life & Health" },
    { id: "birla-sunlife", name: "Aditya Birla Sun Life Insurance", type: "Life & Health" },
    { id: "kotak-life", name: "Kotak Mahindra Life Insurance", type: "Life & Health" },

    // International Insurance Companies
    { id: "aetna", name: "Aetna International", type: "International" },
    { id: "cigna-global", name: "Cigna Global", type: "International" },
    { id: "allianz-global", name: "Allianz Global Assistance", type: "International" },
    { id: "axa", name: "AXA Insurance", type: "International" },
    { id: "bupa-global", name: "Bupa Global", type: "International" },
    { id: "metlife", name: "MetLife", type: "International" },
    { id: "prudential", name: "Prudential Insurance", type: "International" },

    // Corporate / Group Insurance
    { id: "mediassist", name: "Medi Assist (TPA)", type: "TPA" },
    { id: "vidal-health", name: "Vidal Health TPA", type: "TPA" },
    { id: "paramount-tpa", name: "Paramount Health Services TPA", type: "TPA" },
    { id: "good-health", name: "Good Health TPA", type: "TPA" },
    { id: "heritage-tpa", name: "Heritage Health TPA", type: "TPA" },

    // Other Popular Providers
    { id: "cholamandalam", name: "Cholamandalam MS General Insurance", type: "Health" },
    { id: "iffco-tokio", name: "IFFCO Tokio General Insurance", type: "Health" },
    { id: "liberty-general", name: "Liberty General Insurance", type: "Health" },
    { id: "shriram-general", name: "Shriram General Insurance", type: "Health" },
    { id: "magma-hdi", name: "Magma HDI General Insurance", type: "Health" },
    { id: "raheja-qbe", name: "Raheja QBE General Insurance", type: "Health" },
];

// Get provider name by ID
export const getProviderName = (id) => {
    const provider = INSURANCE_PROVIDERS.find(p => p.id === id);
    return provider ? provider.name : id;
};

// Get provider by ID
export const getProviderById = (id) => {
    return INSURANCE_PROVIDERS.find(p => p.id === id);
};

// Group providers by type
export const getProvidersByType = (type) => {
    return INSURANCE_PROVIDERS.filter(p => p.type === type);
};
