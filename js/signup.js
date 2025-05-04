document.addEventListener('DOMContentLoaded', function(){
    const signupButton = document.querySelector('#confirmbutton');
    const inputs = document.querySelectorAll('#inputs input');

    //handle button click
    signupButton.addEventListener('click', handleSignup);

    //checks for 'Enter' key in any input
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e){
            if (e.key === 'Enter') handleSignup();
        });
    });

    function handleSignup(){
        const name = document.querySelector('input[placeholder="Name"]').value.trim();
        const email = document.querySelector('.newEmail').value.trim();
        const balance = parseFloat(document.querySelector('.newBalance').value.trim());
        const username = document.querySelector('.newUsername').value.trim();
        const password = document.querySelector('.newPassword').value.trim();
        const password2 = document.querySelector('.password2').value.trim();

        //validation
        if (!name || !email || !username || !password || !password2 || isNaN(balance)) {
            alert('Please fill in all required fields correctly');
            return;
        }

        if (password !== password2){
            alert('The passwords do not match!');
            return;
        }

        //checks if username exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)){
            alert('Username already taken');
            return;
        }

        //creates user
        const newUser = { name, email, balance, username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        //redirect
        window.location.href = 'index.html';
    }
});