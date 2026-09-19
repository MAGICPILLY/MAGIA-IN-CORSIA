let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let eraseStep = 0;

// Ridimensionamento e reset nativo del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Reset totale profondo (elimina ogni micro-alone grigio)
function clearCanvasCompletely() {
    // Il reset della larghezza distrugge la memoria dei pixel a livello hardware
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

// Sensore Giroscopio con azzeramento hardware del canvas
window.addEventListener('deviceorientation', (e) => {
    const beta = e.beta;   // Inclinazione avanti/indietro (-180 a 180)
    const gamma = e.gamma; // Inclinazione sinistra/destra (-90 a 90)

    const isTiltedForward = (beta < -20 || beta > 110);
    const isStableSide = Math.abs(gamma) < 30;

    if (isTiltedForward && isStableSide) {
        eraseStep++;
        
        // Sfumatura iniziale graduale
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dopo la sfumatura (circa 8-10 frame), esegue il reset totale dei pixel
        if (eraseStep > 8) {
            clearCanvasCompletely();
        }
    } else {
        // Se la cancellazione si era avviata, al ritorno in posizione pulisce del tutto
        if (eraseStep > 0) {
            clearCanvasCompletely();
            eraseStep = 0;
        }
    }
});
