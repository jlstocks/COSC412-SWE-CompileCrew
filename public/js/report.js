document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //shows name of user
    document.querySelector('.username').textContent = `Hello ${user.name || user.username}`;

    const container = document.getElementById('BasicDiv');

    try {
        //get expense report from api
        const response = await fetch(`/api/reports/${user.id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch report data');
        }
        
        const reportData = await response.json();
        if (reportData.total === 0) {
            container.innerHTML += '<h2 id="center">No expenses to report</h2>';
            return;
        }
    
    const expenses = user.expenses || [];
    if (expenses.length === 0) {
        container.innerHTML += '<h2 id="center">No expenses to report</h2>';
        return;
    }

    //add total to page
    const total = reportData.total ? parseFloat(reportData.total) : 0;
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

    reportData.categoryTotals.forEach(category => {
        const li = document.createElement('li');
        li.textContent = `${category._name || 'Uncategorized'}: $${parseFloat(category.total).toFixed(2)}`;
        list.appendChild(li);
    });

    container.appendChild(list);
  } catch (error){
    container.innerHTML += '<h2 id="center"> Error loading report</h2>';
    console.error(error);
  }
});
