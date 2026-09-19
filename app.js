let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let isErasing = false;
let flatFramesCount = 0;

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
    flatFramesCount = 0;
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

// Gestione Sensori Ricalibrata (Xiaomi 15T Pro - Lock Portrait)
window.addEventListener('devicemotion', (e) => {
    // Se stai toccando o disegnando, blocca qualsiasi conteggio
    if (isDrawing) {
        flatFramesCount = 0;
        return;
    }

    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

    const absX = Math.abs(acc.x || 0);
    const absY = Math.abs(acc.y || 0);
    const absZ = Math.abs(acc.z || 0);

    // Condizione di "Telefono Piatto/Orizzontale REALE":
    // 1. Z > 8.8 (la gravità scarica quasi del tutto perpendicolare al display)
    // 2. Y < 2.2 (impedisce la cancellazione con il bordo piegato a 45° verso di te)
    const isStrictlyFlat = absZ > 8.8 && absY < 2.2 && absX < 2.5;

    if (isStrictlyFlat) {
        flatFramesCount++;
        // Richiede stabilità in posizione orizzontale per qualche frame
        if (flatFramesCount > 5) {
            isErasing = true;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        flatFramesCount = 0;
        // Quando lo rialzi in posizione normale/verticale, pialla del tutto il canvas a zero aloni
        if (isErasing) {
            clearCanvasCompletely();
            isErasing = false;
        }
    }
});
