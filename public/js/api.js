//API base URL
const API_BASE_URL = 'http://localhost:3000/api';

//helps make API requests
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

//handles authentication requests
const auth = {
    //signup as new user
    register: (userData) => apiRequest('/register', 'POST', userData),
    
    //login existing user
    login: (credentials) => apiRequest('/login', 'POST', credentials),
    
    //store users current session
    setCurrentUser: (user) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    //get user from current session
    getCurrentUser: () => {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    //remove users current session
    logout: () => {
        sessionStorage.removeItem('currentUser');
    }
};

//manage expenses
const expenses = {
    //add an expense
    add: (expenseData) => apiRequest('/expenses', 'POST', expenseData),
    
    //get expenses for active user
    getAll: (userId) => apiRequest(`/expenses/${userId}`),
    
    //get recent expenses
    getRecent: (userId, days = 7) => apiRequest(`/expenses/${userId}/recent?days=${days}`)
};

//manage balance and budget
const account = {
    //update balance
    updateBalance: (userId, balance) => apiRequest('/update-balance', 'POST', { userId, balance }),
    
    //update budget
    updateBudget: (userId, budget) => apiRequest('/update-budget', 'POST', { userId, budget })
};

//manage reports
const reports = {
    //get spending report
    get: (userId) => apiRequest(`/reports/${userId}`)
};

//get categories
const categories = {
    getAll: () => apiRequest('/categories')
};

//export API functions globally
const api = {
    auth,
    expenses,
    account,
    reports,
    categories
};
window.api = api;
