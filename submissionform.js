// Store previously submitted names and attacks (case-insensitive)
let submittedDigimonNames = [];
let submittedAttackNames = [];

// Load existing names from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const storedDigimons = JSON.parse(localStorage.getItem('digimonEntries')) || [];
    submittedDigimonNames = storedDigimons.map(d => d.name.toLowerCase());
    submittedAttackNames = storedDigimons.map(d => d.attackName.toLowerCase());
});

// Handle ETC checkbox functionality
document.getElementById('etc-checkbox').addEventListener('change', function () {
    const etcContainer = document.getElementById('etc-inputs');
    etcContainer.innerHTML = ''; // Clear all existing dynamic fields

    if (this.checked) {
        addNumberedInput(1); // Add the first numbered input when ETC is checked
    }
});

// Function to dynamically add numbered input fields
function addNumberedInput(number) {
    const etcContainer = document.getElementById('etc-inputs');
    const inputGroup = document.createElement('div');
    inputGroup.className = 'etc-input';
    inputGroup.innerHTML = `
        <span>${number}.</span>
        <input type="text" class="etc-field" placeholder="Type your element" />
    `;
    etcContainer.appendChild(inputGroup);

    const newInput = inputGroup.querySelector('.etc-field');
    newInput.addEventListener('input', () => {
        if (newInput.value.trim() !== '' && !document.querySelector(`.etc-input:nth-child(${number + 1})`)) {
            addNumberedInput(number + 1);
        }
    });

    // Remove empty trailing fields on blur
    newInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (!etcContainer.contains(document.activeElement)) {
                removeEmptyFields(number);
            }
        }, 100);
    });
}

// Function to remove trailing empty fields
function removeEmptyFields(currentNumber) {
    const etcContainer = document.getElementById('etc-inputs');
    const allInputs = Array.from(etcContainer.querySelectorAll('.etc-input'));

    allInputs.forEach((inputGroup, index) => {
        const inputField = inputGroup.querySelector('.etc-field');
        if (inputField.value.trim() === '' && index + 1 > currentNumber) {
            inputGroup.remove(); // Remove empty input fields beyond the current one
        }
    });
}

// Validation Functions
function validateDigimonName() {
    const digimonName = document.getElementById('digimon-name').value.trim();
    const error = document.getElementById('digimon-name-error');
    const lowerCaseName = digimonName.toLowerCase();

    if (submittedDigimonNames.includes(lowerCaseName)) {
        error.textContent = 'This Digimon name is already taken (case-insensitive).';
        error.style.display = 'block';
        return false;
    } else if (digimonName.length < 3) {
        error.textContent = 'Please type 3 or more characters.';
        error.style.display = 'block';
        return false;
    } else if (digimonName.length > 20) {
        error.textContent = 'Please type 20 characters or less.';
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

function validateDescription() {
    const description = document.getElementById('description').value.trim();
    const error = document.getElementById('description-error');
    if (description.length < 100) {
        error.textContent = 'Description must be at least 100 characters.';
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

function validateSignatureAttackName() {
    const attackName = document.getElementById('attack-name').value.trim();
    const error = document.getElementById('attack-name-error');
    const lowerCaseAttack = attackName.toLowerCase();

    if (attackName === '') {
        error.textContent = 'Please state the Signature Attack name.';
        error.style.display = 'block';
        return false;
    } else if (submittedAttackNames.includes(lowerCaseAttack)) {
        error.textContent = 'This Signature Attack name is already taken (case-insensitive).';
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

function validateElements() {
    const elementsError = document.getElementById('elements-error');
    const selectedElements = document.querySelectorAll('input[name="element"]:checked');
    const etcInputs = Array.from(document.querySelectorAll('#etc-inputs .etc-field'));
    const hasEtcValue = etcInputs.some(input => input.value.trim() !== '');

    if (selectedElements.length === 0 && !hasEtcValue) {
        elementsError.textContent = 'Please select at least one element.';
        elementsError.style.display = 'block';
        return false;
    } else {
        elementsError.style.display = 'none';
        return true;
    }
}

function validateLevel() {
    const level = document.getElementById('digivolution-level').value;
    let levelError = document.getElementById('level-error');
    if (!levelError) {
        levelError = document.createElement('span');
        levelError.id = 'level-error';
        levelError.className = 'error-message';
        document.getElementById('digivolution-level').insertAdjacentElement('afterend', levelError);
    }

    if (!level) {
        levelError.textContent = 'Please select a Digivolution Level.';
        levelError.style.display = 'block';
        return false;
    } else {
        levelError.style.display = 'none';
        return true;
    }
}

function validateImage() {
    const imageInput = document.getElementById('digimon-image').files[0];
    const imageError = document.getElementById('digimon-image-error');

    if (!imageInput) {
        imageError.textContent = 'Please upload a Digimon image.';
        imageError.style.display = 'block';
        return false;
    } else if (!['image/jpeg', 'image/png'].includes(imageInput.type)) {
        imageError.textContent = 'Only JPG and PNG files are allowed.';
        imageError.style.display = 'block';
        return false;
    } else if (imageInput.size > 2 * 1024 * 1024) {
        imageError.textContent = 'File size must not exceed 2MB.';
        imageError.style.display = 'block';
        return false;
    } else {
        imageError.style.display = 'none';
        return true;
    }
}

function validateOriginStory() {
    const originStory = document.getElementById('origin-story').value.trim();
    const error = document.getElementById('origin-story-error');
    const rarity = document.querySelector('input[name="rarity"]:checked');

    if (rarity && rarity.value === 'Legendary' && originStory.length < 150) {
        error.textContent = 'Origin Story must be at least 150 characters.';
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

// Event Listener for Rarity Selection
document.querySelectorAll('input[name="rarity"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const container = document.getElementById('origin-story-container');
        const error = document.getElementById('origin-story-error');
        const textArea = document.getElementById('origin-story');

        if (this.value === 'Legendary') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
            textArea.value = '';
            error.style.display = 'none';
        }
    });
});

// Add real-time validation for all fields
document.getElementById('digimon-name').addEventListener('input', validateDigimonName);
document.getElementById('description').addEventListener('input', validateDescription);
document.getElementById('attack-name').addEventListener('input', validateSignatureAttackName);
document.getElementById('origin-story').addEventListener('input', validateOriginStory);

// Main Form Submission Handler
document.getElementById('submission-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Perform validation
    const isNameValid = validateDigimonName();
    const isDescriptionValid = validateDescription();
    const isAttackNameValid = validateSignatureAttackName();
    const isLevelValid = validateLevel();
    const areElementsValid = validateElements();
    const isImageValid = validateImage();
    const isRarityValid = validateRarity();
    const isOriginStoryValid = validateOriginStory();

    if (
        isNameValid &&
        isDescriptionValid &&
        isAttackNameValid &&
        isLevelValid &&
        areElementsValid &&
        isImageValid &&
        isRarityValid &&
        isOriginStoryValid
    ) {
        // Get the uploaded image file
        const imageFile = document.getElementById('digimon-image').files[0];
        
        // Create a FileReader to convert image to Base64
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Collect all form data
            const digimonName = document.getElementById('digimon-name').value.trim();
            const attackName = document.getElementById('attack-name').value.trim();
            
            const digimonData = {
                name: digimonName,
                description: document.getElementById('description').value.trim(),
                attackName: attackName,
                level: document.getElementById('digivolution-level').value,
                rarity: document.querySelector('input[name="rarity"]:checked').value,
                originStory: document.getElementById('origin-story').value.trim(),
                image: e.target.result, // Base64 encoded image
                timestamp: new Date().toISOString()
            };

            // Save to localStorage
            const storedDigimons = JSON.parse(localStorage.getItem('digimonEntries')) || [];
            storedDigimons.push(digimonData);
            localStorage.setItem('digimonEntries', JSON.stringify(storedDigimons));

            // Add to the submitted names arrays (case-insensitive)
            submittedDigimonNames.push(digimonName.toLowerCase());
            submittedAttackNames.push(attackName.toLowerCase());

            alert('Form submitted successfully! Redirecting to showcase page...');
            window.location.href = '../Showcase Page/showcasepage.html';
        };
        
        // Read the file as Data URL (Base64)
        reader.readAsDataURL(imageFile);
    } else {
        alert('Please fix the highlighted errors before submitting.');
    }
});

function validateRarity() {
    const rarity = document.querySelector('input[name="rarity"]:checked');
    const rarityError = document.getElementById('rarity-error');

    if (!rarity) {
        rarityError.textContent = 'Please select a Rarity.';
        rarityError.style.display = 'block';
        return false;
    } else {
        rarityError.style.display = 'none';
        return true;
    }
}