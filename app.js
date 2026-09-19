// --- MODALITÀ CANVAS ---
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let drawing = false;
let currentColor = '#e74c3c';

function setColor(color) {
    currentColor = color;
}

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY);
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (drawing && e.touches.length === 1) {
        ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
});

canvas.addEventListener('touchend', () => { drawing = false; });

// TRIGGER DISSOLVENZA (Giroscopio o Triplo Tap)
function vanishDrawing() {
    let opacity = 1.0;
    const fadeInterval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            opacity -= 0.1;
            ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, 30);
}

// Inclinazione telefono per dissolvere
window.addEventListener('deviceorientation', (event) => {
    if (event.beta && event.beta > 65) { // Inclinato verso il basso
        vanishDrawing();
    }
});

// --- CAMBIO MODALITÀ NASCOSTO (Swipe a 3 Dita) ---
let startX = 0;

window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 3) {
        startX = e.touches[0].clientX;
    }
});

window.addEventListener('touchend', (e) => {
    if (startX !== 0) {
        const modeCanvas = document.getElementById('mode-canvas');
        const modeCards = document.getElementById('mode-cards');

        if (modeCanvas.classList.contains('active')) {
            modeCanvas.classList.remove('active');
            modeCards.classList.add('active');
        } else {
            modeCards.classList.remove('active');
            modeCanvas.classList.add('active');
        }
        startX = 0;
    }
});

// --- MODALITÀ CARTE ---
function selectCard(index) {
    const cards = document.querySelectorAll('.card-item');
    cards.forEach(c => c.classList.remove('selected'));
    cards[index].classList.add('selected');
}
// --- REGISTRAZIONE SERVICE WORKER (Per Schermo Intero & Offline) ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
}
