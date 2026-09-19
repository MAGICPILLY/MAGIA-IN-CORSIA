let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let eraseCounter = 0;

// Ridimensionamento dinamico del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Cambio colore istantaneo al tocco
document.addEventListener('DOMContentLoaded', () => {
    const colorButtons = document.querySelectorAll('.color-btn');
    
    colorButtons.forEach(btn => {
        const applyColor = (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentColor = btn.getAttribute('data-color');
        };

        btn.addEventListener('pointerdown', applyColor, { passive: false });
        btn.addEventListener('touchstart', applyColor, { passive: false });
    });
});

// Gestione Disegno Libero
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);

// Cambio Modalità Nascosto con Gesture a 3 dita
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 3) {
        toggleMode();
    }
});

function toggleMode() {
    const canvasMode = document.getElementById('mode-canvas');
    const cardsMode = document.getElementById('mode-cards');
    
    canvasMode.classList.toggle('active');
    cardsMode.classList.toggle('active');
}

// Sensore Giroscopio (Dissolvenza Flessibile & Pulizia Completa)
window.addEventListener('deviceorientation', (e) => {
    const beta = e.beta;   // Inclinazione avanti/indietro (-180 a 180)
    const gamma = e.gamma; // Inclinazione sinistra/destra (-90 a 90)

    // Si attiva SOLO quando il telefono viene piegato decisamente in avanti/verso il basso
    // (beta < -20 oppure beta > 110 a seconda dell'orientamento del sensore)
    const isTiltedForward = (beta < -20 || beta > 110);
    const isStableSide = Math.abs(gamma) < 30;

    if (isTiltedForward && isStableSide) {
        // Applica dissolvenza
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        eraseCounter++;

        // Dopo pochi frame di dissolvenza, pulisce totalmente per non lasciare aloni
        if (eraseCounter > 20) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        eraseCounter = 0;
    }
});
