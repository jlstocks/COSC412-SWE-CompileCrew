document.addEventListener('DOMContentLoaded', async () => {
    //checks authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }
    //updates user greeting
    document.querySelector('.username').textContent = `Hello ${currentUser.name || currentUser.username}`;

    //displays expenses
    const expenseContainer = document.getElementById('expense');
    
    try {
        //fetch expenses from API endpoint
        const response = await fetch(`/api/expenses/${currentUser.id}/recent`);
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const recentExpenses = await response.json();
        console.log('Received expenses:', recentExpenses);
        //checks if data is valid
        if (!Array.isArray(recentExpenses)) {
            throw new Error('Invalid response format: Expected an array of expenses');
        }
        //checks if no data available
        if (recentExpenses.length === 0) {
            expenseContainer.innerHTML = '<h3>No expenses found in the last week</h3>';
            return;
        }
        //clears template
        expenseContainer.innerHTML = '';
        
        //adds each expense
        recentExpenses.forEach(expense => {
            const expenseAmount = expense.amount !== undefined ? parseFloat(expense.amount) : 0;
            const expenseElement = document.createElement('div');
            expenseElement.className = 'expense-item';
            expenseElement.innerHTML = `
                <h3 class="type">Type: ${expense.categoryName || 'Uncategorized'}</h3>
                <h3 class="description">Description: ${expense.name || 'No description'}</h3>
                <h3 class="cost">Cost: $${parseFloat(expense.amount).toFixed(2)}</h3>
                <small class="date">${formatDate(expense._date)}</small>
                <hr>
            `;
            expenseContainer.appendChild(expenseElement);
        });
        
        //add total spending
        const total = recentExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const totalElement = document.createElement('div');
        totalElement.className = 'expense-total';
        totalElement.innerHTML = `
            <h2>Total spent this week: $${total.toFixed(2)}</h2>
            <h3>Daily average: $${(total/7).toFixed(2)}</h3>
        `;
        expenseContainer.appendChild(totalElement);
        
    } catch (error) {
        expenseContainer.innerHTML = '<h3>Error loading expenses</h3>';
        console.error(error);
    }
    //help format dates
    function formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        try {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Date parsing error');
        }
    }
});