document.addEventListener('DOMContentLoaded', () => {
    //authentication check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //DOM Elements
    const [usernameDisplay, balanceDisplay, expenseName, expenseAmount, confirmButton] = [
        '.username', '.balance', '.addedExpense', '.newAmount', '#confirmbutton'
    ].map(sel => document.querySelector(sel));
    
    const expenseType = document.querySelector('select');

    //init UI
    usernameDisplay.textContent = `Hello ${currentUser.name || currentUser.username}`;
    balanceDisplay.textContent = `Current Balance: $${currentUser.balance.toFixed(2)}`;
    document.querySelector('.budget').textContent = 
        `Current Budget: $${(currentUser.budget ?? currentUser.balance).toFixed(2)}`;

    //handles expenses
    confirmButton.addEventListener('click', addExpense);

    function addExpense(){
        //validation
        if (!expenseName.value.trim()){
            alert('Please enter a name for your expense. ex: "Groceries")');
            expenseName.focus();
            return;
        }

        const amount = parseFloat(expenseAmount.value);
        if (isNaN(amount) || amount <= 0){
            alert('Please enter a valid positive amount');
            expenseAmount.select();
            return;
        }

        if (amount > currentUser.balance){
            alert(`Sorry- insufficient funds! You need $${(amount - currentUser.balance).toFixed(2)} more.`);
            return;
        }

        //gets category
        const selectedOption = expenseType.options[expenseType.selectedIndex];
        const category = {
            id: selectedOption.className,
            name: selectedOption.textContent
        };

        //creates expense
        const newExpense = {
            id: Date.now(),
            name: expenseName.value.trim(),
            amount,
            category,
            date: new Date().toISOString().split('T')[0],
            userId: currentUser.username //for multi-user support
        };

        //updates data
        updateExpenseData(currentUser, newExpense, amount);

        //UI Feedback
        balanceDisplay.textContent = `Current Balance: $${currentUser.balance.toFixed(2)}`;
        expenseName.value = '';
        expenseAmount.value = '';
        expenseType.selectedIndex = 0;
        
        alert(`Added ${category.name} expense: $${amount.toFixed(2)}`);
    }

    function updateExpenseData(user, expense, amount){
        //updates user
        user.expenses = [...(user.expenses || []), expense];
        user.balance -= amount;
        
        //saves to storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        //updates global expenses
        const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        localStorage.setItem('expenses', JSON.stringify([...allExpenses, expense]));
        
        //updates users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.username === user.username);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
});
