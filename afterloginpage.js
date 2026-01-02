// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get the username from localStorage (set during login)
    const username = localStorage.getItem('digimon-username');
    const welcomeMessage = document.getElementById('welcome-message');

    // Update welcome message if username exists
    if (username) {
        welcomeMessage.textContent = `Welcome, ${username}!`;
    }

    // Button click handlers
    document.getElementById('submit-btn').addEventListener('click', function() {
        window.location.href = '../Submission Form Page/submissionform.html'; // Adjust path as needed
    });

    document.getElementById('showcase-btn').addEventListener('click', function() {
        window.location.href = '../Showcase Page/showcasepage.html'; // Adjust path as needed
    });
});