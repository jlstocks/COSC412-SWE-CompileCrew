document.addEventListener('DOMContentLoaded', () => {
    //checks authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //updates user greeting
    document.querySelector('.username').textContent = `Hello ${currentUser.name || currentUser.username}`;

    //gets expenses 
    const globalExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const userExpenses = currentUser.expenses || [];
    const allExpenses = [...globalExpenses, ...userExpenses]
        .filter(exp => exp.userId === undefined || exp.userId === currentUser.username);

    //filter expenses from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date || expense.createdAt);
        return expenseDate >= oneWeekAgo;
    });

    //sort by date using newest first
    recentExpenses.sort((a, b) => 
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    //displays expenses
    const expenseContainer = document.getElementById('expense');
    if (recentExpenses.length === 0) {
        expenseContainer.innerHTML = '<h3>No expenses found in the last week</h3>';
        return;
    }

    //clears template
    expenseContainer.innerHTML = '';

    //adds each expense
    recentExpenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <h3 class="type">${expense.category?.name || expense.type || 'Uncategorized'}</h3>
            <h3 class="description">${expense.name || expense.label || 'No description'}</h3>
            <h3 class="cost">$${expense.amount.toFixed(2)}</h3>
            <small class="date">${formatDate(expense.date || expense.createdAt)}</small>
            <hr>
        `;
        expenseContainer.appendChild(expenseElement);
    });

    //add total spending
    const total = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalElement = document.createElement('div');
    totalElement.className = 'expense-total';
    totalElement.innerHTML = `
        <h2>Total spent this week: $${total.toFixed(2)}</h2>
        <h3>Daily average: $${(total/7).toFixed(2)}</h3>
    `;
    expenseContainer.appendChild(totalElement);

    //help format dates
    function formatDate(dateString) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
});