/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let totalCorrectChars = 0;
let totalTypedChars = 0;
let totalWords = 0;
let totalTime = 0;
let timerInterval;
let finalTime = "0s";   

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};
// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    totalWords = 0;
    totalTime = 0;


    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    };

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.className = "word";
        if (index === 0) {
            span.style.color = "red"; // Highlight first word
            span.classList.add("current-word");
        }
        wordDisplay.appendChild(span);
    });

    
    inputField.value = "";
    results.textContent = "";
    inputField.disabled = false;
    document.getElementById("accuracy").textContent = "0%";
    document.getElementById("wpm").textContent = "0";
    document.getElementById("timer").textContent = "0s";

    console.log("Mots générés :", wordsToType); 
if(wordsToType.length === 0) {
    console.error("Aucun mot généré ! Mode sélectionné :", modeSelect.value);
}
};

// Type to begin
document.getElementById('start-btn').addEventListener('click', () => {
    // Hiding the head(section 'hero') and showing the game
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
    
    // Beginning
    startTest();
    inputField.focus();
});

// Button to restart
document.getElementById('restart-btn').addEventListener('click', () => {
    startTest(); // Réinitialise complètement le test
    inputField.focus();
});

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
        if (startTime) {
            totalTime = (Date.now() - startTime) / 1000;
            document.getElementById("timer").textContent = formatTime(totalTime);
            }
        }, 1000);
    };
}

//Second or minutes:second format
const formatTime = (seconds) => {
    if (seconds < 60) {
        return `${Math.floor(seconds)}s`;
    } else {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    }
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
        if (!startTime || inputField.value.length === 0) {
           return {  
            currentWpm: "0.00", 
            currentAccuracy: "0.00", 
            globalWpm: "0.00", 
            globalAccuracy: "0.00", 
            time: "0s" 
        };
    }

    const elapsedTime = (Date.now() - startTime) / 1000; // Seconds
    let correctChars = 0;
    for (let i = 0; i < Math.min(inputField.value.length, wordsToType[currentWordIndex].length); i++) {
        if (inputField.value[i] === wordsToType[currentWordIndex][i]) correctChars++;
    };
    const currentAccuracy = (correctChars / wordsToType[currentWordIndex].length) * 100;
    const currentWpm = ((inputField.value.length / 5) / (elapsedTime / 60));
    
    totalCorrectChars += correctChars;
    totalTypedChars += wordsToType[currentWordIndex].length;
    totalWords++;
    totalTime = elapsedTime;
    
    const globalAccuracy = (totalCorrectChars / totalTypedChars) * 100;
    const globalWpm = ((totalTypedChars / 5) / (totalTime / 60));

    return { 
        currentWpm: currentWpm.toFixed(2), 
        currentAccuracy: currentAccuracy.toFixed(2), 
        globalWpm: globalWpm.toFixed(2), 
        globalAccuracy: globalAccuracy.toFixed(2), 
        time: formatTime(totalTime) 
    };
};

//Finalizing typing test
const endTest = () => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    finalTime = formatTime(elapsedTime);
    
    inputField.disabled = true;
    results.innerHTML = `<div class="final-results">Test terminé !</div>`;
    document.getElementById("timer").textContent = finalTime;
    
    clearInterval(timerInterval);
};


// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        event.preventDefault(); // Prevent adding extra spaces

            if (!previousEndTime) previousEndTime = startTime;
            const { currentWpm, currentAccuracy, globalWpm, globalAccuracy, time } = getCurrentStats();
            
            results.textContent = `Mot ${currentWordIndex + 1}: ${currentWpm} WPM, ${currentAccuracy}%`;
            document.getElementById("accuracy").textContent = `${globalAccuracy}%`;
            document.getElementById("wpm").textContent = globalWpm;
            document.getElementById("timer").textContent = time;

            currentWordIndex++;
            
            if (currentWordIndex >= wordsToType.length) {
                
                inputField.disabled = true;
                results.innerHTML = `<div class="final-results">Test terminé !</div>`;
                finalTime = time;
                clearInterval(timerInterval);
                document.getElementById("timer").textContent = finalTime;
            } else {
            previousEndTime = Date.now();
            highlightNextWord();
            inputField.value = ""; // Clear input field after space

            }
    }    
    if (currentWordIndex >= wordsToType.length) {
        endTest(); 
    }

};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
    const words = document.querySelectorAll('.word');
    words.forEach(word => word.classList.remove('current-word'));
    if (currentWordIndex < words.length) {
        words[currentWordIndex].classList.add('current-word');
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();

// Animation lettre
const floatingLetters = document.getElementById('floatingLetters')
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

for (let i=0; i <50; i++){
    const letter = document.createElement('div');
    letter.classList.add('floating-letter');
    letter.textContent = letters[Math.floor(Math.random() * letters.length)];
    letter.style.left = `${Math.random() * 100}%`;
    letter.style.top = `${Math.random() * 100}%`;
    letter.style.animationDelay = `${Math.random() * 10}s`;
    letter.style.animationDuration = `${10 + Math.random() * 20}s`;
    letter.style.opacity = Math.random() * 0.2;
    letter.style.fontSize = `${1 + Math.random() * 2}rem`;
    floatingLetters.appendChild(letter);
};
//Scanline Animation
const scanline = document.createElement('div');
scanline.classList.add('scan-line');
document.body.appendChild(scanline);
// Animation Keyboard
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
      keyElement.classList.add('active');
      setTimeout(() => {
        keyElement.classList.remove('active');
      }, 200);
    }
});

// Fonctionnalité de changement de thème
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.game-container').style.display = 'none';
    startTest();
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light'){
        document.body.classList.add('ligth-mode')
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme)
    });
    // Glitch Animation
    setInterval(() => {
        const glitchElements = document.querySelectorAll('.logo-text, .hero h1');
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        randomElement.classList.add('glitch');
        setTimeout(() => {
            randomElement.classList.remove('glitch');
        }, 150);
    }, 2000);
});