document.addEventListener('DOMContentLoaded', () => {
    const signupButton = document.querySelector('#confirmbutton');
    const inputs = document.querySelectorAll('#inputs input');

    //handles form submission
    signupButton.addEventListener('click', handleSignup);
    inputs.forEach(input => input.addEventListener('keypress', (e) => e.key === 'Enter' && handleSignup()));

    function handleSignup() {
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

        //checks if username exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)){
            alert('Username already taken');
            return;
        }

        //creates new user w/budget & defaults to balance
        const newUser = { 
            name, 
            email, 
            balance,
            budget: balance, //initialize budget = balance
            username, 
            password 
        };

        //save and redirects
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
    }
});