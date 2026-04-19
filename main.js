// Main script for interaction

// Simple stagger for elements if needed via JS or just CSS
document.querySelectorAll('.stutter-entry').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
});

// Scratch-to-Reveal Logic
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let isDrawing = false;

function initCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  
  // Fill with Faded Black / Charcoal Ink
  ctx.fillStyle = '#1A1A1B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some initial grain/texture via JS
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? '#222' : '#111';
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

function handleStart(e) {
  isDrawing = true;
  scratch(e);
}

const auraPopup = document.getElementById('aura-popup');
const closeAura = document.getElementById('close-aura');
let revealed = false;

function checkReveal() {
  if (revealed) return;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let transparentPixels = 0;
  
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] === 0) transparentPixels++;
  }
  
  const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
  
  if (percentage > 35) {
    revealed = true;
    triggerCelebration();
  }
}

function triggerCelebration() {
    if (auraPopup) {
        auraPopup.style.display = 'flex';
        // Add a chaotic jitter to the background when celebrating
        document.body.style.animation = 'jitter 0.1s steps(2) infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 1000);
    }
}

if (closeAura) {
    closeAura.addEventListener('click', () => {
        auraPopup.style.display = 'none';
        document.body.style.animation = '';
    });
}

function handleEnd() {
  isDrawing = false;
  ctx.beginPath();
  checkReveal();
}

function scratch(e) {
  if (!isDrawing) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
  const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
  
  ctx.globalCompositeOperation = 'destination-out';
  
  // "Rough" Brush Logic: Draw multiple jittered points
  for (let i = 0; i < 8; i++) {
    const rx = x + (Math.random() - 0.5) * 15;
    const ry = y + (Math.random() - 0.5) * 15;
    const size = 5 + Math.random() * 10;
    
    ctx.beginPath();
    ctx.arc(rx, ry, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Events
canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', scratch);
window.addEventListener('mouseup', handleEnd);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleStart(e);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  scratch(e);
});
window.addEventListener('touchend', handleEnd);

// Resize handling
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initCanvas, 200);
});

initCanvas();

// Easter Egg Popup Trigger
const popup = document.getElementById('easter-egg-popup');
const closeBtn = document.getElementById('close-popup');

setTimeout(() => {
    if (popup) {
        popup.style.display = 'flex';
        // Force a slight jitter when it appears
        popup.querySelector('.scrap').style.animation = 'jitter 0.2s steps(3)';
    }
}, 7000);

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });
}
