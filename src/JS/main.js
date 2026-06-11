import { Application } from 'pixi.js';
import { gsap } from 'gsap';

// ==========================================
// 1. INICIALIZAR EL LIENZO DE PIXI.JS
// ==========================================
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

// ==========================================
// 2. LOOPS INFINITOS DE FONDO (INTERFAZ)
// ==========================================
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

// --- SUB-TIMELINE REUTILIZABLE PARA EL GLITCH (ESTROBOSCÓPICO) ---
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

// ==========================================
// 3. SECUENCIA DE IMPACTO CINEMÁTICO COREOGRAFIADA
// ==========================================
const introTimeline = gsap.timeline();

// Seteo de estados antes de la detonación (Removimos #final-navbar y #brand-layer ya que se manejan distinto ahora)
gsap.set(['#loader-top', '#loader-bottom', '#ticker-wrap-1', '#ticker-wrap-2', '#character-container', '#main-posters-bg'], { opacity: 0 });

// PRE-ALINEACIÓN: Mandamos los posters laterales hacia atrás del primero
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
    // GOLPE 1: Flash estroboscópico agresivo
    .to('body', { backgroundColor: '#ffffff', duration: 0.05 })
    .to('body', { backgroundColor: '#ef4444', duration: 0.05 })
    .to('body', { backgroundColor: '#0b0b0d', duration: 0.1 })

    // GOLPE 2: RÁFAGA ESTROBOSCÓPICA DE AMBOS LOGOS (GLITCH INICIAL)
    .add(crearEfectoGlitch())

    // Inicializar capa contenedora de la intro
    .to('#intro-posters', { opacity: 1, duration: 0.01 })

    // === ARREGLO DE APARICIÓN EN ABANICO DISTRIBUIDO ===
    .to(posters[0], { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' })
    .to(posters.slice(1), { opacity: 1, scale: 1, x: 0, duration: 0.35, ease: 'power4.out', stagger: 0.01 }, '-=0.1')

    // FASE FOTOS: Carga de imágenes
    .to('.poster-img', { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out', stagger: 0.02 }, '-=0.25')

    // FASE TEXTOS: Despliegue de datos
    .to('.poster-data', { opacity: 1, y: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)', stagger: 0.03 }, '-=0.2')

    // === TIEMPO DE PAUSA Y CONTEMPLACIÓN ===
    .to({}, { duration: 0.1 })

    // CORRIDA VELOZ
    .to('.poster-carousel-track', { scaleY: 0.85, duration: 0.12, ease: 'power3.in' })
    .to('.poster-carousel-track', { x: () => `-${window.innerWidth * 1.5}px`, duration: 0.55, ease: 'linear' }, '-=0.12')

    // MACHETAZO SECO: Apagón intermedio absoluto
    .to('#machetazo-dark', { opacity: 1, duration: 0.03 }) 
    .to('.poster-carousel-track', { x: () => `-${window.innerWidth * 2.5}px`, duration: 0.6, ease: 'power1.in' }, '-=0.12')
    .to('#machetazo-dark', { opacity: 0, duration: 0.04 }) 

    // GOLPE INTERMEDIO: Destello de barras
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 1, scaleY: 2, duration: 0.05 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0, scaleY: 1, duration: 0.05 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0.8, duration: 0.04 })
    .to(['#ticker-wrap-1', '#ticker-wrap-2'], { opacity: 0, duration: 0.03 })

    // ESTABILIZACIÓN DEFINITIVA
    .to('body', { backgroundColor: '#0b0b0d', duration: 0.1 }) 
    
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

// ==========================================
// 4. SISTEMA DE CONTROL DE PORCENTAJE (LOADING)
// ==========================================
const loadStatus = { percentage: 0 };
introTimeline.to(loadStatus, {
    percentage: 100,
    duration: 3,
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
            // Pausa contemplando el 100% de la barra
            .to({}, { duration: 0.2 })
            
            // FULMINACIÓN QUIRÚRGICA
            .set(['#loader-top', '#loader-bottom', '#ticker-wrap-1', '#ticker-wrap-2', '#main-posters-bg'], {
                opacity: 0
            })
            
            // Lanzamos el efecto glitch
            .add(crearEfectoGlitch())
            
            // Flash cromático final
            .to('body', { backgroundColor: '#ffffff', duration: 0.04 })
            .to('body', { backgroundColor: '#EE8027', duration: 0.04 })
            .to('body', { 
                backgroundColor: '#0b0b0d', 
                duration: 0.06,
                onComplete: () => {
                    
                    // 💥 AQUÍ OCURRE LA MAGIA: ELIMINAMOS EL CONTENEDOR COMPLETO
                    gsap.to('#preloader-wrapper', {
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            const preloader = document.getElementById('preloader-wrapper');
                            if (preloader) preloader.remove(); // Se elimina físicamente del DOM
                            
                            // Revelamos el contenido principal futuro
                            gsap.to('#main-content', { opacity: 1, duration: 0.5 });
                            const mainContent = document.getElementById('main-content');
                            if (mainContent) mainContent.classList.remove('pointer-events-none');
                        }
                    });

                    // Devolvemos el control al usuario (Scroll y Clicks habilitados)
                    document.body.classList.remove('overflow-hidden', 'select-none');
                }
            });
    }
});