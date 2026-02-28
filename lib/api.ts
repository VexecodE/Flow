/**
 * API Service Layer - Connects Frontend to FastAPI Backend
 * Backend URL: http://localhost:8000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TransactionCreateDTO {
    date: string;
    description: string;
    category: string;
    amount: number;
    type: "Income" | "Expense";
    user_id: string;
    invoice_ref?: string;
    source?: "manual" | "scan" | "voice";
}

export interface TransactionUpdateDTO {
    date?: string;
    description?: string;
    category?: string;
    amount?: number;
    type?: "Income" | "Expense";
}

export interface TransactionFilterDTO {
    user_id?: string;
    category?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
}

export interface TransactionResponseDTO {
    id: string;
    date: string;
    description: string;
    category: string;
    type: "Income" | "Expense";
    amount: number;
    status: "Completed" | "Pending";
    user_id: string;
    invoice_ref?: string;
    source?: string;
    created_at: string;
    updated_at?: string;
}

export interface TransactionStatsDTO {
    total_income: number;
    total_expense: number;
    balance: number;
    transaction_count: number;
    top_categories: Array<{ category: string; amount: number }>;
    monthly_trend: Array<{ month: string; income: number; expense: number }>;
}

/**
 * Transaction API Service
 */
export const TransactionAPI = {
    /**
     * Get all transactions with optional filters
     */
    async getAll(filters?: TransactionFilterDTO): Promise<TransactionResponseDTO[]> {
        const params = new URLSearchParams();
        if (filters?.user_id) params.append('user_id', filters.user_id);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.date_from) params.append('date_from', filters.date_from);
        if (filters?.date_to) params.append('date_to', filters.date_to);
        if (filters?.search) params.append('search', filters.search);

        const url = `${API_BASE_URL}/api/transactions${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get a single transaction by ID
     */
    async getById(id: string): Promise<TransactionResponseDTO> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch transaction: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Create a new transaction
     */
    async create(transaction: TransactionCreateDTO): Promise<TransactionResponseDTO> {
        const response = await fetch(`${API_BASE_URL}/api/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create transaction: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Create multiple transactions at once
     */
    async bulkCreate(transactions: TransactionCreateDTO[]): Promise<TransactionResponseDTO[]> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactions),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to bulk create transactions: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Update an existing transaction
     */
    async update(id: string, data: TransactionUpdateDTO): Promise<TransactionResponseDTO> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update transaction: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Delete a transaction
     */
    async delete(id: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete transaction: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get transaction statistics and summary
     */
    async getStats(userId: string): Promise<TransactionStatsDTO> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/stats/summary?user_id=${userId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch statistics: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get all unique categories for a user
     */
    async getCategories(userId: string): Promise<string[]> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/categories/list?user_id=${userId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.categories || [];
    },

    /**
     * Search transactions
     */
    async search(userId: string, query: string): Promise<{ results: TransactionResponseDTO[]; count: number }> {
        const response = await fetch(`${API_BASE_URL}/api/transactions/search/query?user_id=${userId}&q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Failed to search transactions: ${response.statusText}`);
        }
        
        return response.json();
    },
};

/**
 * Health check - test if backend is running
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
        });
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
}

// ==================== Resume Parsing API ====================

export interface ParsedEducation {
    institution: string;
    degree: string;
    year: string;
}

export interface ParsedExperience {
    title: string;
    description: string;
}

export interface ParsedSkillCategory {
    category: string;
    skills: string[];
}

export interface ParsedResumeData {
    name?: string;
    role?: string;
    email?: string;
    location?: string;
    phone?: string;
    aboutMe?: string;
    education: ParsedEducation[];
    experience: ParsedExperience[];
    skillCategories: ParsedSkillCategory[];
}

export interface ResumeParseResponse {
    success: boolean;
    message: string;
    data?: ParsedResumeData;
}

/**
 * Resume Parsing Service
 */
export const resumeAPI = {
    /**
     * Parse resume file (PDF or DOCX) and extract structured data
     */
    async parseResume(file: File): Promise<ResumeParseResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/resume/parse`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to parse resume');
        }

        return response.json();
    },

    /**
     * Health check for resume parser service
     */
    async health(): Promise<{ status: string; service: string }> {
        const response = await fetch(`${API_BASE_URL}/api/resume/health`);
        
        if (!response.ok) {
            throw new Error('Resume parser service is unavailable');
        }
        
        return response.json();
    },
};
