document.addEventListener('DOMContentLoaded', () => {
    //get DOM elements
    const userDisplay = document.querySelector('.username');
    const balanceDisplay = document.querySelector('.balance');
    const budgetDisplay = document.querySelector('.budget');
    const logoutLink = document.querySelector('#rightLink a');

    //checks authentication
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user){
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //displays user data with fallbacks
    userDisplay.textContent = `Hello ${user.name || user.username}`;
    const balance = user.balance !== undefined && user.balance !== null ? parseFloat(user.balance) : 0;
    balanceDisplay.textContent = `Current Balance: $${balance.toFixed(2)}`;
    const budget = user.budget !== undefined && user.budget !== null ? parseFloat(user.budget) : balance;
    budgetDisplay.textContent = `Current Budget: $${budget.toFixed(2)}`;


    //handles logout
    if (logoutLink){
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'logIn.html';
        });
    }
});
