document.addEventListener('DOMContentLoaded', () => {
    //checks authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in first');
        window.location.href = 'logIn.html';
        return;
    }

    //displays user greeting
    document.querySelector('.username').textContent = `Hello ${currentUser.name || currentUser.username}`;

    //gets all expenses
    const globalExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const userExpenses = currentUser.expenses || [];
    const allExpenses = [...globalExpenses, ...userExpenses]
        .filter(exp => !exp.userId || exp.userId === currentUser.username);

    //creates recommendations container
    const recommendationsContainer = document.createElement('div');
    recommendationsContainer.id = 'recommendations';
    document.getElementById('BasicDiv').appendChild(recommendationsContainer);

    //if no expenses then show basic tips
    if (allExpenses.length === 0){
        recommendationsContainer.innerHTML = `
            <div class="recommendation-card">
                <h3>Getting Started Tips</h3>
                <ul>
                    <li> Set up your monthly budget in Update Balance/Budget</li>
                    <li> Track your first expense using Add Expenses</li>
                    <li> Aim to save at least 20% of your income</li>
                </ul>
            </div>
        `;
        return;
    }

    //calculates spending metrics
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentExpenses = allExpenses.filter(exp => 
        new Date(exp.date || exp.createdAt) >= oneMonthAgo);
    
    const totalSpent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dailyAverage = totalSpent / 30;
    const budget = currentUser.budget || currentUser.balance * 0.8;

    const categorySpending = recentExpenses.reduce((acc, exp) => {
        const category = exp.category?.name || exp.type || 'Other';
        acc[category] = (acc[category] || 0) + exp.amount;
        return acc;
    }, {});

    const recommendations = [];

    if (budget && totalSpent > budget) {
        const overBy = ((totalSpent - budget) / budget * 100).toFixed(1);
        recommendations.push({
            priority: 1,
            html: `You're <strong>${overBy}% over budget</strong> this month. Consider reducing spending.`
        });
    }

    const topCategory = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory[1] > totalSpent * 0.4){
        recommendations.push({
            priority: 2,
            html: `Your <strong>${topCategory[0]}</strong> spending is ${(topCategory[1]/totalSpent*100).toFixed(0)}% of total expenses. Look for ways to optimize.`
        });
    }

    if (currentUser.balance > 1000 && !currentUser.budget){
        recommendations.push({
            priority: 3,
            html: `You have a healthy balance! Set up a budget to maximize the potential of your savings.`
        });
    }

    if (dailyAverage > 50){
        recommendations.push({
            priority: 4,
            html: `Your daily spending average is <strong>$${dailyAverage.toFixed(2)}</strong>. Small daily savings can add up quickly!`
        });
    }

    if (recommendations.length === 0){
        recommendations.push({
            priority: 5,
            html: `Good job managing your expenses! Consider setting savings goals for your future.`
        });
    }

    recommendations
        .sort((a, b) => a.priority - b.priority)
        .forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = rec.html;
            recommendationsContainer.appendChild(card);
        });
});
