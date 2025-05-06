document.addEventListener('DOMContentLoaded', () => {
    //authentication check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //displays current info
    const displayBalance = () => {
        const balance = currentUser.balance !== undefined && currentUser.balance !== null ? parseFloat(currentUser.balance) : 0;
        document.querySelector('.balance').textContent = 
        `Current Balance: $${currentUser.balance.toFixed(2)}`;
    };
    const displayBudget = () => {
        const balance = currentUser.balance !== undefined && currentUser.balance !== null ? parseFloat(currentUser.balance) : 0;
        document.querySelector('.budget').textContent = 
        `Current Budget: $${(currentUser.budget ?? currentUser.balance).toFixed(2)}`;
    };

    document.querySelector('.username').textContent = `Hello ${currentUser.name || currentUser.username}`;
    displayBalance();
    displayBudget();

    //DOM elements
    const [balanceInput, budgetInput] = ['.updatedBalance', '.updatedBudget']
        .map(sel => document.querySelector(sel));
    const confirmButton = document.querySelector('#confirmbutton');

    confirmButton.addEventListener('click', async () => {
        //gets values 
        const balanceVal = balanceInput.value.trim();
        const budgetVal = budgetInput.value.trim();

        //validates at least one field
        if (!balanceVal && !budgetVal) {
            alert('Please enter at least one value to update');
            return;
        }

        try {
            //processes balance
            if (balanceVal) {
                const newBalance = parseFloat(balanceVal);
                if (isNaN(newBalance)) {
                    balanceInput.select();
                    alert('Please enter a valid number for balance');
                    return;
                }
                
                //update balance on server
                const balanceResponse = await fetch('/api/update-balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        accountId: currentUser.accountId,
                        balance: newBalance
                    })
                });
                
                if (!balanceResponse.ok) {
                    const data = await balanceResponse.json();
                    throw new Error(data.error || 'Failed to update balance');
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
                
                //update budget on server
                const budgetResponse = await fetch('/api/update-budget', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        budget: newBudget
                    })
                });
                
                if (!budgetResponse.ok) {
                    const data = await budgetResponse.json();
                    throw new Error(data.error || 'Failed to update budget');
                }
                
                currentUser.budget = newBudget;
            }

            //saves updates to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            //updates UI
            displayBalance();
            displayBudget();
            balanceInput.value = '';
            budgetInput.value = '';

            alert('Updated successfully!');
        } catch (error) {
            alert('Error updating: ' + error.message);
        }
    });
});
