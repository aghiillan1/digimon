// Event listener for the Register button
const registerButton = document.getElementById("register-button");
if (registerButton) {
    registerButton.addEventListener("click", function () {
        window.location.href = "../Registration Page/registrationpage.html";
    });
}

// Event listener for the Login button
const loginButton = document.getElementById("login-button");
if (loginButton) {
    loginButton.addEventListener("click", function () {
        window.location.href = "../Login Page/loginpage.html";
    });
}

// Handle video end event
const video = document.getElementById("background-video");
const overlay = document.getElementById("overlay");
const content = document.querySelector(".content");

// When the video ends
video.addEventListener("ended", function () {
    overlay.style.display = "block"; // Show gray overlay
    setTimeout(() => {
        overlay.style.opacity = 1; // Smooth opacity transition
        content.classList.remove("hidden"); // Reveal content
        content.style.opacity = 1; // Make content visible
    }, 100); // Delay for smooth effect
});

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("background-audio");

    // Create a mute/unmute button
    const muteButton = document.createElement("button");
    muteButton.textContent = "Mute Music";
    muteButton.style.position = "fixed";
    muteButton.style.top = "10px";
    muteButton.style.right = "10px";
    muteButton.style.padding = "10px";
    muteButton.style.backgroundColor = "#ff5722";
    muteButton.style.color = "white";
    muteButton.style.border = "none";
    muteButton.style.borderRadius = "5px";
    muteButton.style.cursor = "pointer";
    muteButton.style.zIndex = "3";
    document.body.appendChild(muteButton);

    // Ensure audio starts muted
    audio.muted = true;

    // Play audio after user interaction
    document.body.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().then(() => {
                console.log("Audio started playing.");
                audio.muted = false; // Unmute audio on first play
                muteButton.textContent = "Mute Music"; // Update button text
            }).catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    });

    // Mute/unmute button functionality
    muteButton.addEventListener("click", () => {
        if (audio.muted) {
            audio.muted = false;
            muteButton.textContent = "Mute Music";
        } else {
            audio.muted = true;
            muteButton.textContent = "Unmute Music";
        }

    });
});