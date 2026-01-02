document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const elements = {
        digimonList: document.getElementById("digimon-list"),
        searchInput: document.getElementById("search-input"),
        searchBtn: document.getElementById("search-btn"),
        rarityFilter: document.getElementById("rarity-filter"),
        emptyState: document.getElementById("empty-state"),
        randomDigimonBtn: document.getElementById("random-digimon-btn"),
        modals: {
            evolution: document.getElementById("evolution-modal"),
            random: document.getElementById("random-modal")
        },
        buttons: {
            close: document.querySelectorAll(".close-button"),
            closeEvolution: document.getElementById("close-evolution-btn"),
            closeRandom: document.getElementById("close-random-btn"),
            randomEvolution: document.getElementById("random-evolution-btn"),
            saveRandom: document.getElementById("save-random-digimon"),
            generateAnother: document.getElementById("generate-another")
        },
        randomDigimon: {
            img: document.getElementById("random-digimon-img"),
            name: document.getElementById("random-digimon-name"),
            level: document.getElementById("random-digimon-level"),
            type: document.getElementById("random-digimon-type"),
            attribute: document.getElementById("random-digimon-attribute"),
            attack: document.getElementById("random-digimon-attack")
        }
    };

    // Data
    let digimonData = JSON.parse(localStorage.getItem("digimonEntries")) || [];
    let currentRandomDigimon = null;

    // Digimon database for random generation
    const digimonDatabase = {
        names: ["Agumon", "Gabumon", "Patamon", "Gatomon", "Tentomon", "Palmon", "Gomamon", "Biyomon", "Veemon", "Hawkmon"],
        levels: ["Fresh", "In-Training", "Rookie", "Champion", "Ultimate", "Mega"],
        types: ["Reptile", "Mammal", "Bird", "Insect", "Plant", "Aquatic", "Machine", "Holy", "Dark"],
        attributes: ["Vaccine", "Data", "Virus", "Free"],
        attacks: ["Pepper Breath", "Bubble Blow", "Horn Attack", "Leaf Slash", "Aqua Blast", 
                 "Fire Tower", "Lightning Blade", "Ice Claw", "Holy Light", "Darkness Wave"],
        images: [
            "../Pictures/agumon.jpg",
            "../Pictures/gabumon.jpg",
            "../Pictures/patamon.jpg",
            "../Pictures/gatomon.jpg",
            "../Pictures/tentomon.jpg",
            "../Pictures/palmon.jpg",
            "../Pictures/gomamon.jpg",
            "../Pictures/biyomon.jpg",
            "../Pictures/veemon.jpg",
            "../Pictures/hawkmon.jpg"
        ],
        freshDigimon: ["Punimon", "Poyomon", "Yuramon", "Botamon"],
        inTrainingDigimon: ["Tsunomon", "Tokomon", "Pichimon", "Zurumon"]
    };

    // Predefined evolution chains
    const evolutionChains = {
        "Agumon": {
            "Fresh": "Punimon",
            "In-Training": "Tsunomon",
            "Rookie": "Agumon",
            "Champion": "Greymon",
            "Ultimate": "MetalGreymon",
            "Mega": "WarGreymon"
        },
        "Gabumon": {
            "Fresh": "Punimon",
            "In-Training": "Pichimon",
            "Rookie": "Gabumon",
            "Champion": "Garurumon",
            "Ultimate": "WereGarurumon",
            "Mega": "MetalGarurumon"
        },
        "Patamon": {
            "Fresh": "Poyomon",
            "In-Training": "Tokomon",
            "Rookie": "Patamon",
            "Champion": "Angemon",
            "Ultimate": "MagnaAngemon",
            "Mega": "Seraphimon"
        },
        "Gatomon": {
            "Fresh": "Punimon",
            "In-Training": "Salamon",
            "Rookie": "Gatomon",
            "Champion": "Angewomon",
            "Ultimate": "Magnadramon",
            "Mega": "Ophanimon"
        },
        "Veemon": {
            "Fresh": "Punimon",
            "In-Training": "Pupumon",
            "Rookie": "Veemon",
            "Champion": "ExVeemon",
            "Ultimate": "Paildramon",
            "Mega": "Imperialdramon"
        }
    };

    // Initialize the page
    function init() {
        displayDigimon(digimonData);
        setupEventListeners();
        checkEmptyState();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Search functionality
        elements.searchBtn.addEventListener("click", filterDigimon);
        elements.searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") filterDigimon();
        });

        // Filter by rarity
        elements.rarityFilter.addEventListener("change", filterDigimon);

        // Modal controls
        elements.buttons.close.forEach(btn => {
            btn.addEventListener("click", closeAllModals);
        });

        elements.buttons.closeEvolution.addEventListener("click", () => closeModal('evolution'));
        elements.buttons.closeRandom.addEventListener("click", () => closeModal('random'));

        window.addEventListener("click", (e) => {
            if (e.target === elements.modals.evolution) closeModal('evolution');
            if (e.target === elements.modals.random) closeModal('random');
        });

        // Random Digimon Generator
        elements.randomDigimonBtn.addEventListener("click", generateRandomDigimon);
        elements.buttons.generateAnother.addEventListener("click", generateRandomDigimon);
        elements.buttons.saveRandom.addEventListener("click", saveRandomDigimon);
        elements.buttons.randomEvolution.addEventListener("click", showRandomEvolutionChain);
    }

    // Filter and display Digimon
    function filterDigimon() {
        const searchTerm = elements.searchInput.value.toLowerCase();
        const rarityValue = elements.rarityFilter.value;
        
        const filteredDigimon = digimonData.filter(digimon => {
            const matchesSearch = 
                digimon.name.toLowerCase().includes(searchTerm) || 
                digimon.description.toLowerCase().includes(searchTerm) ||
                digimon.attackName.toLowerCase().includes(searchTerm);
            
            const matchesRarity = !rarityValue || digimon.rarity === rarityValue;
            
            return matchesSearch && matchesRarity;
        });
        
        displayDigimon(filteredDigimon);
    }

    // Display Digimon cards
    function displayDigimon(digimonArray) {
        elements.digimonList.innerHTML = "";
        
        if (digimonArray.length === 0) {
            elements.emptyState.style.display = "block";
            elements.digimonList.style.display = "none";
            return;
        }
        
        elements.emptyState.style.display = "none";
        elements.digimonList.style.display = "grid";
        
        digimonArray.forEach((digimon, index) => {
            const card = createDigimonCard(digimon, index);
            elements.digimonList.appendChild(card);
        });
        
        addCardEventListeners();
    }

    // Create a Digimon card element
    function createDigimonCard(digimon, index) {
        const card = document.createElement("div");
        card.className = "card";
        
        const shortDescription = digimon.description.length > 200 
            ? `${digimon.description.substring(0, 200)}...` 
            : digimon.description;
        
        const hasOriginStory = digimon.rarity === "Legendary" && digimon.originStory;
        const originStoryContent = hasOriginStory ? `
            <div class="origin-story-container">
                <div class="origin-story-label">Origin Story:</div>
                <div class="origin-story-text">${digimon.originStory}</div>
            </div>
        ` : '';
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${digimon.image}" alt="${digimon.name}" loading="lazy"
                     onerror="this.src='../Pictures/digimon_placeholder.jpg'">
            </div>
            <div class="card-content">
                <h2>${digimon.name}</h2>
                <div class="card-meta">
                    <span><b>Level:</b> ${digimon.level}</span>
                    <span><b>Rarity:</b> ${digimon.rarity}</span>
                    <span><b>Attack:</b> ${digimon.attackName}</span>
                </div>
                <div class="card-description-container">
                    <div class="description-label">Description:</div>
                    <p class="card-description" title="${digimon.description}">${shortDescription}</p>
                </div>
                ${originStoryContent}
                <div class="card-actions">
                    <button class="view-evolution-btn" data-index="${index}">View Evolution</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Add event listeners to cards
    function addCardEventListeners() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", deleteDigimon);
        });
        
        document.querySelectorAll(".view-evolution-btn").forEach(btn => {
            btn.addEventListener("click", showEvolutionTree);
        });
    }

    // Delete a Digimon
    function deleteDigimon(e) {
        const index = e.target.getAttribute("data-index");
        const digimonName = digimonData[index].name;
        
        if (confirm(`Are you sure you want to delete ${digimonName}?`)) {
            digimonData.splice(index, 1);
            localStorage.setItem("digimonEntries", JSON.stringify(digimonData));
            displayDigimon(digimonData);
            checkEmptyState();
        }
    }

    // Show evolution tree modal
    function showEvolutionTree(e) {
        const index = e.target.getAttribute("data-index");
        const digimon = digimonData[index];
        
        document.getElementById("modal-title").textContent = `${digimon.name}'s Evolution Tree`;
        
        // Get the chain or create a custom one for user-created Digimon
        let chain = evolutionChains[digimon.name] || generateCustomEvolutionChain(digimon);
        updateEvolutionStages(chain, digimon);
        
        openModal('evolution');
    }

    // Generate custom evolution chain for user-created Digimon
    function generateCustomEvolutionChain(digimon) {
        const chain = {
            "Fresh": "Punimon",
            "In-Training": "Tsunomon",
            "Rookie": digimon.level === "Rookie" ? digimon.name : "Agumon",
            "Champion": digimon.level === "Champion" ? digimon.name : "Greymon",
            "Ultimate": digimon.level === "Ultimate" ? digimon.name : "MetalGreymon",
            "Mega": digimon.level === "Mega" ? digimon.name : "WarGreymon"
        };
        return chain;
    }

    // Update evolution stages in modal
    function updateEvolutionStages(chain, currentDigimon) {
        for (const [stage, digimonName] of Object.entries(chain)) {
            const stageId = `${stage.toLowerCase().replace(' ', '-')}-stage`;
            const stageElement = document.getElementById(stageId);
            
            if (stageElement) {
                // Update name
                const nameElement = stageElement.querySelector(".evo-name");
                nameElement.textContent = digimonName;
                
                // Update image
                const imgElement = stageElement.querySelector(".evo-image");
                
                // If this is the current Digimon's level, use its image
                if (digimonName === currentDigimon.name) {
                    imgElement.src = currentDigimon.image;
                    imgElement.alt = currentDigimon.name;
                    nameElement.style.color = "#FF4500";
                    nameElement.style.fontWeight = "bold";
                    stageElement.style.backgroundColor = "rgba(255, 69, 0, 0.1)";
                } else {
                    imgElement.src = `../Pictures/${digimonName.toLowerCase()}.jpg`;
                    imgElement.alt = digimonName;
                    nameElement.style.color = "";
                    nameElement.style.fontWeight = "";
                    stageElement.style.backgroundColor = "";
                }
                
                imgElement.onerror = function() {
                    this.src = "../Pictures/digimon_placeholder.jpg";
                };
            }
        }
    }

    // Generate random evolution chain
    function generateRandomEvolutionChain(currentDigimon) {
        return {
            "Fresh": getRandomElement(digimonDatabase.freshDigimon),
            "In-Training": getRandomElement(digimonDatabase.inTrainingDigimon),
            "Rookie": currentDigimon.level === "Rookie" ? currentDigimon.name : getRandomElement(digimonDatabase.names),
            "Champion": currentDigimon.level === "Champion" ? currentDigimon.name : getRandomElement(digimonDatabase.names),
            "Ultimate": currentDigimon.level === "Ultimate" ? currentDigimon.name : getRandomElement(digimonDatabase.names),
            "Mega": getRandomElement(digimonDatabase.names)
        };
    }

    // Show random evolution chain
    function showRandomEvolutionChain() {
        const randomChain = generateRandomEvolutionChain({
            name: "Random",
            level: getRandomElement(["Rookie", "Champion", "Ultimate"])
        });
        updateEvolutionStages(randomChain, {
            name: "Random",
            image: "../Pictures/digimon_placeholder.jpg"
        });
    }

    // Generate random Digimon
    function generateRandomDigimon() {
        const { name, level, type, attribute, attack, image, rarity } = generateRandomDigimonData();
        
        // Update modal display
        elements.randomDigimon.name.textContent = name;
        elements.randomDigimon.level.textContent = level;
        elements.randomDigimon.type.textContent = type;
        elements.randomDigimon.attribute.textContent = attribute;
        elements.randomDigimon.attack.textContent = attack;
        elements.randomDigimon.img.src = image;
        elements.randomDigimon.img.alt = name;
        elements.randomDigimon.img.onerror = function() {
            this.src = "../Pictures/digimon_placeholder.jpg";
        };
        
        // Store for potential saving
        currentRandomDigimon = {
            name,
            level,
            type,
            attribute,
            attackName: attack,
            image,
            rarity,
            description: generateRandomDescription(name, level, type, attribute, attack),
            createdAt: new Date().toISOString()
        };
        
        openModal('random');
    }

    // Generate random Digimon data
    function generateRandomDigimonData() {
        return {
            name: getRandomElement(digimonDatabase.names),
            level: getRandomElement(["Rookie", "Champion", "Ultimate"]),
            type: getRandomElement(digimonDatabase.types),
            attribute: getRandomElement(digimonDatabase.attributes),
            attack: getRandomElement(digimonDatabase.attacks),
            image: getRandomElement(digimonDatabase.images),
            rarity: getRandomRarity()
        };
    }

    // Save random Digimon to collection
    function saveRandomDigimon() {
        if (!currentRandomDigimon) return;
        
        digimonData.push(currentRandomDigimon);
        localStorage.setItem("digimonEntries", JSON.stringify(digimonData));
        
        alert(`${currentRandomDigimon.name} has been added to your collection!`);
        closeModal('random');
        displayDigimon(digimonData);
        checkEmptyState();
    }

    // Generate random description
    function generateRandomDescription(name, level, type, attribute, attack) {
        const descriptions = [
            `${name} is a ${level}-level ${type} Digimon with ${attribute} attribute. Its special attack "${attack}" makes it a formidable opponent in battle.`,
            `This ${level} Digimon ${name} belongs to the ${type} family and wields the power of ${attribute}. Watch out for its "${attack}" move!`,
            `${name}, the ${level}-level ${type} Digimon, uses its ${attribute} powers to execute the devastating "${attack}" technique.`,
            `A powerful ${level} Digimon, ${name} is a ${type}-type creature with ${attribute} alignment. Its signature move is "${attack}".`
        ];
        
        return getRandomElement(descriptions);
    }

    // Modal control functions
    function openModal(modalName) {
        elements.modals[modalName].style.display = "block";
        document.body.style.overflow = "hidden";
    }

    function closeModal(modalName) {
        elements.modals[modalName].style.display = "none";
        document.body.style.overflow = "auto";
    }

    function closeAllModals() {
        Object.values(elements.modals).forEach(modal => {
            modal.style.display = "none";
        });
        document.body.style.overflow = "auto";
    }

    // Check and update empty state
    function checkEmptyState() {
        if (digimonData.length === 0) {
            elements.emptyState.style.display = "block";
            elements.digimonList.style.display = "none";
        }
    }

    // Helper functions
    function getRandomRarity() {
        const rand = Math.random();
        if (rand < 0.6) return "Common";
        if (rand < 0.9) return "Rare";
        return "Legendary";
    }

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Initialize the application
    init();
});