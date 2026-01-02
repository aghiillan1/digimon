document.getElementById('registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const fullName = document.getElementById('full-name').value.trim();
    const usernameInput = document.getElementById('username');
    const username = document.getElementById('username').value.trim();
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const passwordInput = document.getElementById('password');
    const password = document.getElementById('password').value;
    const confirmPasswordInput = document.getElementById('confirm-password');
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;
    const avatar = document.getElementById('avatar').files[0];
    const digimonInput = document.getElementById('digimon');
    const digimon = digimonInput.value;
    const regionInput = document.getElementById('region');
    const region = regionInput.value;

    // Retrieve existing users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

     // Check if username is already taken
    if (registeredUsers.some(user => user.username === username)) {
        const usernameError = document.getElementById('username-error');
        usernameError.textContent = 'This username is taken. Try another username.';
        usernameError.style.display = 'block';
        return;
    }

    // Add new user to the registered users array
    registeredUsers.push({ username, password });

    // Check if email is already taken
    if (registeredUsers.some(user => user.email === email)) {
        const emailError = document.getElementById('email-error');
        emailError.textContent = 'This email is taken. Try another email.';
        emailError.style.display = 'block';
        return;
    }
    

    // Username Validation
    if (!/^[a-zA-Z0-9]{5,12}$/.test(username)) {
        alert('Username must be 5–12 characters long and contain only letters and numbers.');
        return;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email address. Please include "@" and ".com".');
        return;
    }

    // Password Validation
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        alert('Password must be at least 8 characters long and include both letters and numbers.');
        return;
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Digimon Validation
    if (!digimon) {
        const digimonError = document.getElementById('digimon-error');
        digimonError.style.display = 'block';
        return;
    }

    // Region Validation
    if (!region) {
        const regionError = document.getElementById('region-error');
        regionError.style.display = 'block';
        return;
    }

    // Avatar Validation
    if (avatar) {
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(avatar.type)) {
            alert('Avatar must be a JPG or PNG file.');
            return;
        }
        if (avatar.size > 1024 * 1024) { // 1MB limit
            alert('Avatar file size must not exceed 1MB.');
            return;
        }
    }

    // Terms and Conditions Validation
    if (!termsAccepted) {
        alert('You must agree to the Terms and Conditions.');
        return;
    }

    // Save new user to localStorage
    registeredUsers.push({ username, email });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    alert('Registration successful!');
    window.location.href = '../Login Page/loginpage.html'; // Redirect to login page
});

// Real-time Username Validation
const usernameInput = document.getElementById('username');
const usernameError = document.createElement('span');
usernameError.style.color = 'red';
usernameError.style.fontWeight = 'bold';
usernameError.style.display = 'none';
usernameInput.insertAdjacentElement('afterend', usernameError);

usernameInput.addEventListener('input', () => {
    const username = usernameInput.value.trim();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (registeredUsers.some(user => user.username === username)) {
        usernameError.textContent = 'This username is taken. Try another username.';
        usernameError.style.display = 'block';
    } else if (username.length < 5) {
        usernameError.textContent = 'Username must be at least 5 characters.';
        usernameError.style.display = 'block';
    } else if (username.length > 12) {
        usernameError.textContent = 'Username cannot exceed 12 characters.';
        usernameError.style.display = 'block';
    } else {
        usernameError.style.display = 'none'; // Hide the error message if valid
    }
});

// Real-time Email Validation
const emailInput = document.getElementById('email');
const emailError = document.createElement('span');
emailError.style.color = 'red';
emailError.style.fontWeight = 'bold';
emailError.style.display = 'none';
emailInput.insertAdjacentElement('afterend', emailError);

emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (registeredUsers.some(user => user.email === email)) {
        emailError.textContent = 'This email is taken. Try another email.';
        emailError.style.display = 'block';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = 'Invalid email address. Please include "@" and ".com".';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none'; // Hide the error message if valid
    }
});

// Real-time Password Validation
const passwordInput = document.getElementById('password');
const passwordError = document.createElement('span');
passwordError.style.color = 'red';
passwordError.style.fontWeight = 'bold';
passwordError.style.display = 'none';
passwordInput.insertAdjacentElement('afterend', passwordError);

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length < 8) {
        passwordError.textContent = 'Password must be at least 8 characters.';
        passwordError.style.display = 'block';
    } else if (!/[0-9]/.test(password)) {
        passwordError.textContent = 'Password must include at least one number.';
        passwordError.style.display = 'block';
    } else if (!/[a-zA-Z]/.test(password)) {
        passwordError.textContent = 'Password must include at least one letter.';
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none'; // Hide the error message if valid
    }
});

// Real-time Confirm Password Validation
const confirmPasswordInput = document.getElementById('confirm-password');
const confirmPasswordError = document.createElement('span');
confirmPasswordError.style.color = 'red';
confirmPasswordError.style.fontWeight = 'bold';
confirmPasswordError.style.display = 'none';
confirmPasswordInput.insertAdjacentElement('afterend', confirmPasswordError);

confirmPasswordInput.addEventListener('input', () => {
    const confirmPassword = confirmPasswordInput.value;
    const password = passwordInput.value;

    if (confirmPassword !== password) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        confirmPasswordError.style.display = 'block';
    } else {
        confirmPasswordError.style.display = 'none'; // Hide the error message if valid
    }
});

// Real-time Validation for Digimon Selection
const digimonInput = document.getElementById('digimon');
digimonInput.addEventListener('change', () => {
    const digimonError = document.getElementById('digimon-error');
    if (digimonInput.value) {
        digimonError.style.display = 'none'; // Hide error message when valid
    }
});

// Real-time Validation for Region Selection
const regionInput = document.getElementById('region');
regionInput.addEventListener('change', () => {
    const regionError = document.getElementById('region-error');
    if (regionInput.value) {
        regionError.style.display = 'none'; // Hide error message when valid
    }
});

function registerUser() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  if (username && password) {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    console.log("Saved Username:", localStorage.getItem("username")); // Debugging
    console.log("Saved Password:", localStorage.getItem("password")); // Debugging
    alert("Registration Successful!");
    window.location.href = "loginpage.html"; // Redirect to login page
  } else {
    alert("Please fill in all fields.");
  }
}
