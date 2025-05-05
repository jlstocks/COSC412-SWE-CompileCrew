document.addEventListener('DOMContentLoaded', () => {
    //authication check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //displays current info
    const displayBalance = () => document.querySelector('.balance').textContent = 
        `Current Balance: $${currentUser.balance.toFixed(2)}`;
    const displayBudget = () => document.querySelector('.budget').textContent = 
        `Current Budget: $${(currentUser.budget ?? currentUser.balance).toFixed(2)}`;

    document.querySelector('.username').textContent = `Hello ${currentUser.name || currentUser.username}`;
    displayBalance();
    displayBudget();

    //DOM elements
    const [balanceInput, budgetInput] = ['.updatedBalance', '.updatedBudget']
        .map(sel => document.querySelector(sel));
    const confirmButton = document.querySelector('#confirmbutton');

    confirmButton.addEventListener('click', () => {
        //gets values 
        const balanceVal = balanceInput.value.trim();
        const budgetVal = budgetInput.value.trim();

        //validates at least one field
        if (!balanceVal && !budgetVal) {
            alert('Please enter at least one value to update');
            return;
        }

        //processes balance
        if (balanceVal) {
            const newBalance = parseFloat(balanceVal);
            if (isNaN(newBalance)) {
                balanceInput.select();
                alert('Please enter a valid number for balance');
                return;
            }
            currentUser.balance = newBalance;
        }

        //processes budget
        if (budgetVal) {
            const newBudget = parseFloat(budgetVal);
            if (isNaN(newBudget)) {
                budgetInput.select();
                alert('Please enter a valid number for budget');
                return;
            }
            currentUser.budget = newBudget;
        }

        //saves updates
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        //updates users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.username === currentUser.username);
        if (index !== -1) users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));

        //updates UI
        displayBalance();
        displayBudget();
        balanceInput.value = '';
        budgetInput.value = '';

        alert('Updated successfully!');
    });
});