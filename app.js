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

// Sensore Giroscopio: Modalità Invertita (Verticale = Disegno, Orizzontale = Cancella)
window.addEventListener('deviceorientation', (e) => {
    if (isDrawing) return;

    const absBeta = Math.abs(e.beta || 0);
    const absGamma = Math.abs(e.gamma || 0);

    // Scatta la cancellazione SOLO quando il telefono scende verso la posizione orizzontale (beta < 25)
    // Quando è in verticale (beta > 45), la cancellazione è totalmente disattivata.
    const isHorizontal = absBeta < 25 && absGamma < 30;

    if (isHorizontal) {
        isErasing = true;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Appena torna in posizione verticale, pialla del tutto il canvas
        if (isErasing) {
            clearCanvasCompletely();
            isErasing = false;
        }
    }
});
