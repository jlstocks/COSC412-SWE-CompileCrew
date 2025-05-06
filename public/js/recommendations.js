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
    const recommendationsContainer = document.getElementById('recommendations');

    //if no expenses then show basic tips
    if (allExpenses.length === 0) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <h3>Getting Started Tips</h3>
            <ul>
                <li>Set up your monthly budget in Update Balance/Budget</li>
                <li>Track your first expense using Add Expenses</li>
                <li>Aim to save at least 20% of your income</li>
            </ul>
        `;
        recommendationsContainer.appendChild(card);
    } else {
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
        
        if (topCategory && topCategory[1] > totalSpent * 0.4) {
            recommendations.push({
                priority: 2,
                html: `Your <strong>${topCategory[0]}</strong> spending is ${(topCategory[1]/totalSpent*100).toFixed(0)}% of total expenses. Look for ways to optimize.`
            });
        }

        if (currentUser.balance > 1000 && !currentUser.budget) {
            recommendations.push({
                priority: 3,
                html: `You have a healthy balance! Set up a budget to maximize the potential of your savings.`
            });
        }

        if (dailyAverage > 50) {
            recommendations.push({
                priority: 4,
                html: `Your daily spending average is <strong>$${dailyAverage.toFixed(2)}</strong>. Small daily savings can add up quickly!`
            });
        }

        if (recommendations.length === 0) {
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
    }

    //chat functions
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    
    //add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    //function to send a message to the server
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        //add a message to the chat
        addMessage(message, true);
        userInput.value = '';
        
        typingIndicator.style.display = 'block';
        
        try {
            //send a message to the server
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            typingIndicator.style.display = 'none';
            
            if (data.error) {
                addMessage(`Error: ${data.error}`);
            } else {
                addMessage(data.reply);
            }
        } catch (error) {
            typingIndicator.style.display = 'none';
            addMessage(`Sorry, there was an error: ${error.message}`);
        }
    }
    
    //event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
