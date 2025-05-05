document.addEventListener('DOMContentLoaded', function(){
    const loginButton = document.querySelector('#confirmbutton');
    const usernameInput = document.querySelector('.username');
    const passwordInput = document.querySelector('.password');

    //handles the button click
    loginButton.addEventListener('click', handleLogin);

    //checks for 'Enter' key in inputs
    usernameInput.addEventListener('keypress', function(e){
        if (e.key === 'Enter') handleLogin();
    });
    passwordInput.addEventListener('keypress', function(e){
        if (e.key === 'Enter') handleLogin();
    });

    function handleLogin(){
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password){
            alert('Please enter your username and password');
            return;
        }

        //check user 
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username);

        if (!user){
            alert('Username not found');
            return;
        }

        if (user.password !== password){
            alert('Password incorrect');
            return;
        }

        //login success
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html'; //redirect
    }
});