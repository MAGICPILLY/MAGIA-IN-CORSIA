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

// Reset totale profondo (elimina ogni micro-alone)
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
    // Blocca cancellazioni accidentali mentre si disegna
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

// Sensore Giroscopio: Attivazione in posizione ORIZZONTALE
window.addEventListener('deviceorientation', (e) => {
    // Ignora il giroscopio se il dito sta disegnando
    if (isDrawing) return;

    const beta = e.beta;   // Inclinazione dritto/orizzontale
    const gamma = e.gamma; // Inclinazione sinistra/destra

    // In posizione verticale/impugnatura beta è circa 60°-90°.
    // Quando lo sdrai quasi in orizzontale, beta scende sotto i 25°.
    const isHorizontal = (beta < 25 && beta > -25);
    const isStableSide = Math.abs(gamma) < 35;

    if (isHorizontal && isStableSide) {
        isErasing = true;
        // Dissolvenza veloce
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Appena rialzi il telefono in verticale, formatta la tela a bianco puro
        if (isErasing) {
            clearCanvasCompletely();
            isErasing = false;
        }
    }
});
