const images = [
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg'
];

let cards = [...images, ...images];
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(imageUrl, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    
    // Resim yükleme hatası kontrolü
    img.onerror = function() {
        console.error(`Resim yüklenemedi: ${imageUrl}`);
        // Varsayılan bir kart resmi kullanabilirsiniz
        this.style.background = '#2196F3';
        this.style.content = '🎴';
    };
    
    card.appendChild(img);
    card.addEventListener('click', flipCard);
    
    return card;
}

function flipCard() {
    if (flippedCards.length === 2) return;
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function showSuccessImage(isGameEnd = false) {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    
    const successImg = document.createElement('img');
    successImg.src = './images/yes.jpg';
    
    // Resim yükleme hatası kontrolü
    successImg.onerror = function() {
        console.error('Başarı resmi yüklenemedi');
        successImg.src = './images/yes.jpg';
    };
    
    successOverlay.appendChild(successImg);
    document.body.appendChild(successOverlay);
    
    if (!isGameEnd) {
        setTimeout(() => {
            successOverlay.remove();
        }, 3000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = cards[card1.dataset.index] === cards[card2.dataset.index];

    if (match) {
        matchedPairs++;
        flippedCards = [];
        
        setTimeout(() => {
            card1.style.transition = 'opacity 0.5s ease-out';
            card2.style.transition = 'opacity 0.5s ease-out';
            card1.style.opacity = '0';
            card2.style.opacity = '0';
            
            setTimeout(() => {
                card1.remove();
                card2.remove();
                
                showSuccessImage(false);
                
                if (matchedPairs === images.length) {
                    setTimeout(() => {
                        showSuccessImage(true);
                        setTimeout(() => {
                            alert(`Tebrikler! Oyunu ${moves} hamlede bitirdiniz!`);
                            resetGame();
                        }, 3500);
                    }, 3000);
                }
            }, 500);
        }, 1000);
        
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    const existingOverlay = document.querySelector('.success-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    document.getElementById('moves').textContent = moves;
    initializeGame();
}

function initializeGame() {
    cards = shuffle(cards);
    const gameContainer = document.getElementById('gameContainer');
    
    cards.forEach((imageUrl, index) => {
        const card = createCard(imageUrl, index);
        gameContainer.appendChild(card);
    });
}

initializeGame(); 