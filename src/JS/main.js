import { Application } from 'pixi.js';
import { gsap } from 'gsap';

const pixiContainer = document.getElementById('pixi-bg');
const app = new Application();

async function initBackground() {
  try {
    if (pixiContainer) {
        await app.init({ resizeTo: window, backgroundAlpha: 0 });
        pixiContainer.appendChild(app.canvas);
    }
  } catch (error) {
    console.error("Error cargando PixiJS background:", error);
  }
}
initBackground();

gsap.to('#ticker-wrap-1 .ticker-track', { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
gsap.to('#ticker-wrap-2 .ticker-track-reverse', { xPercent: -50, ease: 'none', duration: 20, repeat: -1 });

gsap.utils.toArray('.bg-poster-grid').forEach((poster, index) => {
    const xMovement = (index % 2 === 0) ? 40 : -40;
    const yMovement = (index % 3 === 0) ? 50 : -30;
    gsap.to(poster, {
        x: `+=${xMovement}`, y: `+=${yMovement}`,
        rotation: (index % 2 === 0) ? 3 : -3,
        duration: 6 + (index % 3), ease: 'sine.inOut', repeat: -1, yoyo: true
    });
});

function crearEfectoGlitch() {
    const glitchTL = gsap.timeline();
    glitchTL
        .set('#character-container', { opacity: 1 })
        .to('#glitch-logo-1', { opacity: 1, filter: 'invert(1) contrast(2)', scale: 1.1, duration: 0.03 })
        .to('#glitch-logo-1', { x: -30, duration: 0.02 })
        .set('#glitch-logo-1', { opacity: 0 })
        .set('#glitch-logo-2', { opacity: 1, x: 30, filter: 'invert(0)' })
        .to('#glitch-logo-2', { x: -10, scale: 0.95, duration: 0.03 })
        .set('#glitch-logo-2', { opacity: 0 })
        .set('#glitch-logo-1', { opacity: 0.8, x: 0, filter: 'none' })
        .to('#glitch-logo-1', { opacity: 0, duration: 0.04 })
        .set('#glitch-logo-2', { opacity: 0.9, x: 0 })
        .to('#glitch-logo-2', { opacity: 0, duration: 0.03 })
        .set('#character-container', { opacity: 0 });
    return glitchTL;
}

const introTimeline = gsap.timeline();

gsap.set(['#loader-top', '#loader-bottom', '#ticker-wrap-1', '#ticker-wrap-2', '#character-container', '#main-posters-bg'], { opacity: 0 });

const posters = gsap.utils.toArray('.carousel-poster');
posters.forEach((poster, i) => {
    if(i === 0) {
        gsap.set(poster, { opacity: 0, scale: 0.3, zIndex: 30 });
    } else {
        gsap.set(poster, { opacity: 0, scale: 0.5, x: (i * 15), zIndex: 20 - i });
    }
    gsap.set(poster, { transformOrigin: "center center" });
});

introTimeline
    .to('body', { backgroundColor: '#ffffff', duration: 0.05 })
    .to('body', { backgroundColor: '#4ade80', duration: 0.05 })
    .to('body', { backgroundColor: '#0a0b0d', duration: 0.1 })

    .add(crearEfectoGlitch())

    .to('#intro-posters', { opacity: 1, duration: 0.01 })

    .to(posters[0], { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' })
    .to(posters.slice(1), { opacity: 1, scale: 1, x: 0, duration: 0.35, ease: 'power4.out', stagger: 0.01 }, '-=0.1')

    .to('.poster-img', { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out', stagger: 0.02 }, '-=0.25')

    .to('.poster-data', { opacity: 1, y: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)', stagger: 0.03 }, '-=0.2')

    .to({}, { duration: 0.1 })

    .to('.poster-carousel-track', { scaleY: 0.85, duration: 0.12, ease: 'power3.in' })
    .to('.poster-carousel-track', { x: () => `-${window.innerWidth * 1.5}px`, duration: 0.55, ease: 'linear' }, '-=0.12')

    .to('#machetazo-dark', { opacity: 1, duration: 0.03 }) 
    .to('.poster-carousel-track', { x: () => `-${window.innerWidth * 2.5}px`, duration: 0.6, ease: 'power1.in' }, '-=0.12')
    .to('#machetazo-dark', { opacity: 0, duration: 0.04 }) 

    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 1, scaleY: 2, duration: 0.05 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0, scaleY: 1, duration: 0.05 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0.8, duration: 0.04 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0, duration: 0.03 })

    .to('body', { backgroundColor: '#0a0b0d', duration: 0.1 }) 
    
    .to('#intro-posters', { duration: 0.01, onComplete: () => {
        const el = document.getElementById('intro-posters');
        if (el) el.remove();
    }})

    // Aparecen los pósters secundarios flotando de fondo
    .to('#main-posters-bg', { opacity: 0.65, duration: 0.6, ease: 'power2.out' })
    
    // Despliegue de la UI
    .to('#loader-top', { opacity: 0.6, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.4')
    .to('#loader-bottom', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3')
    
    // Entrada fluida de los tickers
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 1, duration: 0.3, stagger: 0.05 }, '-=0.5');

const loadStatus = { percentage: 0 };
introTimeline.to(loadStatus, {
    percentage: 100,
    duration: 1,
    ease: 'power1.inOut',
    onUpdate: () => {
        const current = Math.floor(loadStatus.percentage);
        const textEl = document.getElementById('progress-text');
        const fillEl = document.getElementById('progress-fill');
        if (textEl) textEl.innerText = `${current.toString().padStart(2, '0')}%`;
        if (fillEl) gsap.set(fillEl, { width: `${current}%` });
    },
    onComplete: () => {
        const exitTimeline = gsap.timeline();

        exitTimeline
            .to({}, { duration: 0.1 })
            
            .set(['#loader-top', '#loader-bottom', '#ticker-wrap-1', '#ticker-wrap-2', '#main-posters-bg'], {
                opacity: 0
            })
            
            .add(crearEfectoGlitch())
            
            .to('body', { backgroundColor: '#ffffff', duration: 0.04 })
            .to('body', { backgroundColor: '#ff7300', duration: 0.04 })
            .to('body', { 
                backgroundColor: '#0a0b0d', // Dark
                duration: 0.06,
                onComplete: () => {
                    
                    gsap.to('#preloader-wrapper', {
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            const preloader = document.getElementById('preloader-wrapper');
                            if (preloader) preloader.remove(); 
                            
                            gsap.to('#main-content', { opacity: 1, duration: 0.5 });
                            const mainContent = document.getElementById('main-content');
                            if (mainContent) mainContent.classList.remove('pointer-events-none');
                        }
                    });

                    document.body.classList.remove('overflow-hidden', 'select-none');
                    
                    if (window.lenis) {
                        window.lenis.start();
                        window.lenis.resize();
                    }
                }
            });
    }
});