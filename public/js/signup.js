document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('#confirmbutton');
    const inputs = document.querySelectorAll('#inputs input');

    //handles form submission
    signupButton.addEventListener('click', handleSignup);
    inputs.forEach(input => input.addEventListener('keypress', (e) => e.key === 'Enter' && handleSignup()));

    async function handleSignup() {
        //get input values
        const name = document.querySelector('input[placeholder="Name"]').value.trim();
        const email = document.querySelector('.newEmail').value.trim();
        const balance = parseFloat(document.querySelector('.newBalance').value.trim()) || 0;
        const username = document.querySelector('.newUsername').value.trim();
        const password = document.querySelector('.newPassword').value.trim();
        const password2 = document.querySelector('.password2').value.trim();

        //validation
        if (!name || !email || !username || !password || !password2 || isNaN(balance)){
            alert('Please fill in all of the fields correctly');
            return;
        }

        if (password !== password2){
            alert('Invalid: Passwords do not match!');
            return;
        }

        if (password.length < 6){
            alert('Invalid: Password needs to be at least 6 characters!');
            return;
        }

        try {
            //send registration request to server
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    username,
                    password,
                    balance
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            //create user object for localStorage
            const newUser = { 
                id: data.userId,
                accountId: data.accountId,
                name, 
                email, 
                balance,
                budget: balance, // Initialize budget = balance
                username
            };

            //store user info in localStorage
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'index.html';
        } catch (error) {
            //handle registration errors
            if (error.message.includes('Username already taken')) {
                alert('Username already taken');
            } else {
                alert('Error registering: ' + error.message);
            }
        }
    }
});
