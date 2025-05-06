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

    async function handleLogin(){
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password){
            alert('Please enter your username and password');
            return;
        }

        try {
            //send login request to server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Invalid username or password');
            }

            //store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } catch (error) {
            
            //handle errors
            if (error.message.includes('Invalid username or password')) {
                alert('Username or password incorrect');
            } else {
                alert('Error logging in: ' + error.message);
            }
        }
    }
});
