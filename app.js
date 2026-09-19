// FORZA L'AGGIORNAMENTO DELLA PWA (Bypassa la cache locale)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
            registration.update();
        }
    });
}

let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Tracciamento del doppio tocco per la cancellazione
let lastTapTime = 0;
const TAP_DELAY = 350; // Millisecondi massimi tra i 2 tocchi
const CORNER_SIZE = 90; // Area in alto a sinistra (90x90px)

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
    });
});

// Gestione Disegno e Riconoscimento Double Tap
function startDrawing(e) {
    // Gestione unificata coordinate per Pointer Events
    const x = e.clientX;
    const y = e.clientY;

    // Controllo se il tocco avviene nell'angolo in alto a sinistra
    if (x <= CORNER_SIZE && y <= CORNER_SIZE) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < TAP_DELAY && tapLength > 0) {
            // Riconosciuto Double Tap: Blocca il disegno ed esegue il reset
            e.preventDefault();
            isDrawing = false;
            
            // Dissolvenza e azzeramento
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            setTimeout(() => {
                clearCanvasCompletely();
            }, 80);

            lastTapTime = 0;
            return;
        }
        
        lastTapTime = currentTime;
        // Se è solo il primo tocco nell'angolo, non avvia il tracciamento
        return;
    }

    // Se siamo fuori dall'angolo di cancellazione, avvia il disegno normale
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

    const x = e.clientX;
    const y = e.clientY;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Eventi Pointer Unificati
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
    
    if (canvasMode && cardsMode) {
        canvasMode.classList.toggle('active');
        cardsMode.classList.toggle('active');
    }
}
