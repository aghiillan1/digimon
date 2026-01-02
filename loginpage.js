document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    // Clear previous error messages
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';

    // Retrieve registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Check if username exists and password matches
    const user = registeredUsers.find(user => user.username === username && user.password === password);

    if (!user) {
        if (!registeredUsers.some(user => user.username === username)) {
            // Username not found
            usernameError.textContent = 'Username not found. Please try again.';
            usernameError.style.display = 'block';
        } else {
            // Incorrect password
            passwordError.textContent = 'Incorrect password. Please try again.';
            passwordError.style.display = 'block';
        }
        return;
    }

    // Successful login - Redirect to the Submission Form Page
    window.location.href = '../After Login Page/afterloginpage.html';
});

// For hardcoded admin credentials (optional fallback)
function loginUser() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Hardcoded admin credentials for quick access
    if (username === "admin" && password === "password") {
        window.location.href = "../After Login Page/afterloginpage.html";
        return;
    }

    alert("Invalid username or password. Please try again.");
}
