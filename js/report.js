document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //shows name of user
    document.querySelector('.username').textContent = `Hello ${user.name || user.username}`;

    const container = document.getElementById('BasicDiv');

    const expenses = user.expenses || [];
    if (expenses.length === 0) {
        container.innerHTML += '<h2 id="center">No expenses to report</h2>';
        return;
    }

    //total spending
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    //spending per category
    const categoryTotals = {};
    expenses.forEach(exp => {
        const category = exp.type || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount;
    });

    //add total to page
    const totalElement = document.createElement('h2');
    totalElement.id = 'center';
    totalElement.textContent = `Total Expenses: $${total.toFixed(2)}`;
    container.appendChild(totalElement);

    //add category breakdown
    const breakdownHeader = document.createElement('h2');
    breakdownHeader.id = 'center';
    breakdownHeader.textContent = 'Spending by Category:';
    container.appendChild(breakdownHeader);

    const list = document.createElement('ul');
    list.style.textAlign = 'center';

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const li = document.createElement('li');
        li.textContent = `${category}: $${amount.toFixed(2)}`;
        list.appendChild(li);
    });

    container.appendChild(list);
});
