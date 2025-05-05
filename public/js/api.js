// API base URL - change this to your server's address
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Authentication
const auth = {
    // Register a new user
    register: (userData) => apiRequest('/register', 'POST', userData),
    
    // Login user
    login: (credentials) => apiRequest('/login', 'POST', credentials),
    
    // Store user in session
    setCurrentUser: (user) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    // Get current user from session
    getCurrentUser: () => {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    // Remove user from session (logout)
    logout: () => {
        sessionStorage.removeItem('currentUser');
    }
};

// Expense management
const expenses = {
    // Add a new expense
    add: (expenseData) => apiRequest('/expenses', 'POST', expenseData),
    
    // Get all expenses for a user
    getAll: (userId) => apiRequest(`/expenses/${userId}`),
    
    // Get recent expenses (last 7 days by default)
    getRecent: (userId, days = 7) => apiRequest(`/expenses/${userId}/recent?days=${days}`)
};

// Balance and budget
const account = {
    // Update user's balance
    updateBalance: (userId, balance) => apiRequest('/update-balance', 'POST', { userId, balance }),
    
    // Update user's budget
    updateBudget: (userId, budget) => apiRequest('/update-budget', 'POST', { userId, budget })
};

// Reports
const reports = {
    // Get user's spending report
    get: (userId) => apiRequest(`/reports/${userId}`)
};

// Categories
const categories = {
    // Get all expense categories
    getAll: () => apiRequest('/categories')
};

// Export all API functions
const api = {
    auth,
    expenses,
    account,
    reports,
    categories
};

// Make it available globally
window.api = api;
