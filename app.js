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

// Gestione Sensori con Differenziale di Gravità Diretto
window.addEventListener('devicemotion', (e) => {
    // Se l'utente sta toccando/disegnando, blocca qualsiasi scansione
    if (isDrawing) {
        flatFramesCount = 0;
        return;
    }

    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

    const absX = Math.abs(acc.x || 0);
    const absY = Math.abs(acc.y || 0);
    const absZ = Math.abs(acc.z || 0);

    // Condizione fisica di "Telefono Sdraiato Piatto":
    // La gravità spinge quasi interamente sull'asse Z (perpendicolare allo schermo > 8.0 m/s²)
    // e gli assi X e Y (lungo la superficie dello schermo) sono quasi azzerati (< 3.5 m/s²).
    const isPhysicalFlat = absZ > 8.0 && absY < 3.5 && absX < 3.5;

    if (isPhysicalFlat) {
        flatFramesCount++;
        // Richiede almeno 4 frame consecutivi in posizione orizzontale prima di attivare la cancellazione
        if (flatFramesCount > 4) {
            isErasing = true;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        flatFramesCount = 0;
        // Appena il telefono torna in posizione verticale/impugnata, se era avviata la cancellazione pialla la tela
        if (isErasing) {
            clearCanvasCompletely();
            isErasing = false;
        }
    }
});
