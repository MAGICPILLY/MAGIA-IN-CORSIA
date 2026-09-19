let currentColor = '#e74c3c';
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Ridimensionamento e reset nativo del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Crea il riquadro di debug fisso
const debugDiv = document.createElement('div');
debugDiv.id = 'sensor-debug';
debugDiv.style.position = 'fixed';
debugDiv.style.top = '10px';
debugDiv.style.left = '10px';
debugDiv.style.background = 'rgba(0,0,0,0.85)';
debugDiv.style.color = '#00ff00';
debugDiv.style.padding = '10px 14px';
debugDiv.style.borderRadius = '8px';
debugDiv.style.fontSize = '14px';
debugDiv.style.fontFamily = 'monospace';
debugDiv.style.zIndex = '99999';
debugDiv.style.pointerEvents = 'none';
debugDiv.innerText = 'ATTESA SENSORE...';
document.body.appendChild(debugDiv);

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

// Lettura Giroscopio con fallback
function handleOrientation(e) {
    const beta = e.beta !== null ? Math.round(e.beta) : 'N/A';
    const gamma = e.gamma !== null ? Math.round(e.gamma) : 'N/A';
    debugDiv.innerText = `BETA: ${beta} | GAMMA: ${gamma}`;
}

window.addEventListener('deviceorientation', handleOrientation, true);
