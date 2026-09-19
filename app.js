let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let isErasing = false;

// Ridimensionamento e reset nativo del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Reset totale profondo (elimina ogni micro-alone grigio)
function clearCanvasCompletely() {
    canvas.width = window.innerWidth;
    ctx.beginPath();
}

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
    // Blocca cancellazioni accidentali mentre disegni
    isErasing = false;
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

// Sensore Giroscopio: Attivazione INCLINANDO VERSO DI TE
window.addEventListener('deviceorientation', (e) => {
    // Ignora il giroscopio mentre il dito sta disegnando
    if (isDrawing) return;

    const beta = e.beta;   // Inclinazione avanti/indietro
    const gamma = e.gamma; // Inclinazione sinistra/destra

    // Scatta SOLO quando pieghi la parte superiore del telefono VERSO DI TE (beta > 50)
    // e il telefono è stabile sull'asse laterale
    const isTiltedTowardsMe = (beta > 50);
    const isStableSide = Math.abs(gamma) < 30;

    if (isTiltedTowardsMe && isStableSide) {
        isErasing = true;
        // Sfumatura rapida
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Quando il telefono torna dritto, se era attiva la cancellazione, pialla tutto a zero
        if (isErasing) {
            clearCanvasCompletely();
            isErasing = false;
        }
    }
});
