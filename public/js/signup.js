document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('#confirmbutton');
    const inputs = document.querySelectorAll('#inputs input');

    //handles form submission
    signupButton.addEventListener('click', handleSignup);
    inputs.forEach(input =>
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSignup();
        })
    );

    async function handleSignup(){
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
            alert('Invalid: Password must be at least 6 characters!');
            return;
        }

        try {
            //registers user
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

            if (!response.ok){
                throw new Error(data.error || 'Registration failed');
            }

            //immediately log in to get complete user data (budget from DB)
            const loginResponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const loginData = await loginResponse.json();

            if (!loginResponse.ok){
                throw new Error('Auto-login failed');
            }

            // Store full user object from DB
            localStorage.setItem('currentUser', JSON.stringify(loginData.user));
            window.location.href = 'index.html';

        } catch (error) {
            if (error.message.includes('Username already taken')){
                alert('Username already taken');
            } else {
                alert('Error registering: ' + error.message);
            }
        }
    }
});

