document.addEventListener('DOMContentLoaded', () => {
    // Animation des lettres flottantes
    const floatingLetters = document.getElementById('floatingLetters');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 50; i++) {
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
    }

    // Gestion du thème
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            document.body.classList.remove('light-mode');
            if (theme === 'light') {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else if (theme === 'dark' || theme === 'default') {
                localStorage.setItem('theme', theme);
            }
        });
    });

    // Récupération du thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Animation sur hover des cartes de profil
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-active');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-active');
        });
    });

    // Animation glitch sur le titre
    setInterval(() => {
        const profileTitle = document.querySelector('.profile-title');
        profileTitle.classList.add('glitch');
        setTimeout(() => {
            profileTitle.classList.remove('glitch');
        }, 150);
    }, 3000);
});