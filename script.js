const landingPage = document.getElementById('landing');
const acceptancePage = document.getElementById('acceptance');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainGif = document.getElementById('mainGif');
const mainQuestion = document.getElementById('mainQuestion');
const countdown = document.getElementById('countdown');
let clickCount = 0;

// Fireworks initialization
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.sx = Math.random() * 3 - 1.5;
        this.sy = Math.random() * -3 - 3;
        this.size = Math.random() * 2 + 1;
        const colorVal = Math.round(0xffffff * Math.random());
        [this.r, this.g, this.b] = [colorVal >> 16, (colorVal >> 8) & 255, colorVal & 255];
        this.shouldExplode = false;
    }
    update() {
        this.shouldExplode = this.sy >= -2 || this.y <= 100 || this.x <= 0 || this.x >= canvas.width;
        this.sy += 0.01;
        [this.x, this.y] = [this.x + this.sx, this.y + this.sy];
    }
    draw() {
        ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, r, g, b) {
        [this.x, this.y, this.sx, this.sy, this.r, this.g, this.b] = [x, y, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, r, g, b];
        this.size = Math.random() * 2 + 1;
        this.life = 100;
    }
    update() {
        [this.x, this.y, this.life] = [this.x + this.sx, this.y + this.sy, this.life - 1];
    }
    draw() {
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const fireworks = [new Firework()];
const particles = [];

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Math.random() < 0.25 && fireworks.push(new Firework());
    fireworks.forEach((firework, i) => {
        firework.update();
        firework.draw();
        if (firework.shouldExplode) {
            for (let j = 0; j < 50; j++) particles.push(new Particle(firework.x, firework.y, firework.r, firework.g, firework.b));
            fireworks.splice(i, 1);
        }
    });
    particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animateFireworks);
}

// Countdown timer
const valentinesDay = new Date('February 14, 2025 00:00:00').getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = valentinesDay - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    countdown.textContent = `${days} days until Valentine's Day! meri Jan 😘😘💕💕 `;
}, 1000);

// Event listeners
let moveCount = 0;
noBtn.addEventListener('mouseover', () => {
    if (moveCount >= 2) return;
    moveCount++;
    
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 50);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 50);
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${Math.max(10, x)}px`;
    noBtn.style.top = `${Math.max(10, y)}px`;
});

noBtn.addEventListener('click', () => {
    clickCount++;
    
    // Update GIF and text based on click count
    switch(clickCount) {
        case 1:
            mainGif.src = 'gif1.gif';
            mainQuestion.textContent = 'Please click Yes kav kav';
            break;
        case 2:
            mainGif.src = 'gif2.gif';
            mainQuestion.textContent = 'Muze boht sads hoga please click Yes';
            break;
        case 3:
            mainGif.src = 'gif3.gif';
            mainQuestion.textContent = 'tu muze udas kar ri';
            noBtn.style.display = 'none';
            yesBtn.style.width = '100%';
            yesBtn.style.borderRadius = '50px';
            break;
    }
    
    // Increase Yes button size
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${currentSize * 1.2}px`;
});
yesBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    acceptancePage.style.display = 'block';
    document.body.style.background = 'linear-gradient(45deg, #ff1493, #ff69b4)';
    document.getElementById('celebrationSound').play();
    animateFireworks();
});