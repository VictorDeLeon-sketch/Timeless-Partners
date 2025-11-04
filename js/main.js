/* ============================================================
   TIMELESS PARTNERS — main.js (versión optimizada y documentada)
   ------------------------------------------------------------
   - Mantiene TODAS las funciones originales (comentadas)
   - Agrega nuevos efectos con Anime.js
   - Cada bloque está documentado para personalización
   ============================================================ */

(function() {
  // ============================================================
  // 🧭 Flags de control para evitar dobles ejecuciones
  // ============================================================
  let heroPlayed = false;
  let initDone = false;

  // Helper simple para evitar errores si algo falla
  function safe(fn) {
    try { fn && fn(); } catch (e) { console.error('Safe wrapper error:', e); }
  }

  // ============================================================
  // ⚙️ FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
  // ============================================================
  function initAll() {
    if (initDone) return;
    initDone = true;

    // ============================================================
    // 🎞️ AOS (Animaciones al hacer scroll)
    // Personaliza: duración, desplazamiento (offset) y easing
    // ============================================================
    if (window.AOS) {
      AOS.init({
        duration: 900,      // ms duración
        once: false,         // true = solo una vez
        mirror: true,      // false = no repite al subir
        offset: 40,         // antes era 120 → activa antes
        easing: 'ease-out-cubic'
      });
    }

    // ============================================================
    // 📅 Inserta el año actual en el footer
    // ============================================================
    safe(() => {
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    });

    // ============================================================
    // 🍔 MENÚ MÓVIL (hamburguesa + drawer)
    // Personaliza animación de entrada/salida si quieres
    // ============================================================
    // ✅ Menú móvil seguro y retrasado para asegurar que el DOM existe
    safe(() => {
      setTimeout(() => {
        const hamburger = document.querySelector('.hamburger');
        const drawer = document.getElementById('mobile-drawer');

        // ✅ Agrega este bloque justo aquí
        if (hamburger && drawer) {
          hamburger.addEventListener('click', () => {
            const isOpen = drawer.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
          });
        }
        if (!hamburger || !drawer) {
          console.warn("⚠️ Menú móvil no encontrado. Verifica clases .hamburger y #mobile-drawer.");
          return;
        }

        console.log("Hamburger ready:", hamburger);
        console.log("Drawer ready:", drawer);

        function toggleDrawer() {
          const isOpen = drawer.classList.toggle('open');
          hamburger.setAttribute('aria-expanded', String(isOpen));
        }

        hamburger.addEventListener('click', toggleDrawer);
        drawer.addEventListener('click', (e) => {
          if (e.target === drawer || e.target.tagName === 'A') {
            drawer.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        });
      }, 400); // espera 0.4 segundos para asegurar renderizado completo
    });

    // ============================================================
    // 📩 FORMULARIO DE CONTACTO (validación + envío simulado)
    // Personaliza mensajes y delays del “envío”
    // ============================================================
    safe(() => {
      const form = document.getElementById('contactForm');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        form.querySelectorAll('.error').forEach(el => el.textContent = '');
        const data = Object.fromEntries(new FormData(form));
        let hasError = false;

        function setError(fieldName, message) {
          const field = form.querySelector(`[name="${fieldName}"]`);
          if (!field) return;
          const container = field.closest('.field');
          if (container) {
            const errorEl = container.querySelector('.error');
            if (errorEl) errorEl.textContent = message;
          }
          field.focus();
        }

        // Validaciones básicas
        if (!data.nombre || data.nombre.trim().length < 2) { setError('nombre', 'Ingresa tu nombre (mínimo 2 caracteres).'); hasError = true; }
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError('email', 'Ingresa un correo electrónico válido.'); hasError = true; }
        if (!data.mensaje || data.mensaje.trim().length < 10) { setError('mensaje', 'Cuéntanos un poco más (mínimo 10 caracteres).'); hasError = true; }

        if (hasError) return;

        try {
          await new Promise(r => setTimeout(r, 600)); // 🔧 simula envío
          alert('¡Gracias! Hemos recibido tu mensaje.');
          form.reset();
        } catch (err) {
          alert('Hubo un problema al enviar tu mensaje. Intenta de nuevo.');
        }
      });
    });

    // ============================================================
    // 🧩 HERO FX CINEMATIC (GSAP)
    // 🔕 DESACTIVADO — Ahora se usa Anime.js abajo
    // ============================================================
    /*
    safe(() => {
      if (heroPlayed) return;
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const headline = hero.querySelector('.hero__text h1');
      const subtext = hero.querySelector('.hero__text p');
      const ctas = hero.querySelectorAll('.hero__cta a, .hero__cta button');
      const art = hero.querySelector('.hero__art img, .hero__art .cover');
      if (headline && window.SplitType && window.gsap) {
        heroPlayed = true;
        const split = new SplitType(headline, { types: "chars,words" });
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.set(hero, { opacity: 1 });
        tl.from(split.chars, { yPercent: 120, z: -80, rotationX: 60, opacity: 0, scale: 0.9, stagger: { each: 0.015, from: "center" }, duration: 1.1 });
        if (subtext) tl.from(subtext, { y: 40, opacity: 0, duration: 0.8 }, "-=0.6");
        if (ctas.length) tl.from(ctas, { y: 20, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.5 }, "-=0.4");
        if (art) tl.from(art, { scale: 1.15, opacity: 0, filter: "blur(8px)", duration: 1.2 }, 0.2);
      }
    });
    */

    // ============================================================
    // 🔵 FEATURES FLOAT (GSAP) — DESACTIVADO
    // ============================================================
    /*
    safe(() => {
      const features = document.querySelectorAll(".features .card, .feature-card");
      if (features.length && window.gsap) {
        gsap.set(features, { opacity: 0, y: 40 });
        gsap.to(features, {
          opacity: 1, y: 0,
          stagger: { each: 0.15, from: "center" },
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features",
            start: "top 90%",
            end: "bottom 20%",
          }
        });
      }
    });
    */

    // ============================================================
    // 🟡 CLIENTES FLOAT CARDS (GSAP) — DESACTIVADO
    // ============================================================
    /*
    safe(() => {
      const clientCards = document.querySelectorAll(".clientes .card");
      if (clientCards.length && window.gsap) {
        gsap.set(clientCards, { opacity: 0, scale: 0.8, y: 60 });
        gsap.to(clientCards, {
          opacity: 1, scale: 1, y: 0,
          stagger: { each: 0.1, from: "center" },
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".clientes",
            start: "top 90%",
            end: "bottom 20%",
          }
        });
      }
    });
    */

    // ============================================================
    // 🔴 PRODUCTOS FAN (GSAP) — DESACTIVADO
    // ============================================================
    /*
    safe(() => {
      const productCards = document.querySelectorAll(".productos .card");
      if (productCards.length && window.gsap) {
        gsap.set(productCards, { opacity: 0, scale: 0.9, y: 80 });
        const centerIndex = Math.floor(productCards.length / 2);
        productCards.forEach((card, i) => {
          const offset = (i - centerIndex) * 60;
          const rotation = (i - centerIndex) * 5;
          gsap.to(card, {
            opacity: 1, y: 0, x: offset, rotateZ: rotation, scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".productos",
              start: "top 90%",
              end: "bottom 20%",
            }
          });
        });
      }
    });
    */
(function() {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;

      // Función personalizada de desplazamiento suave con compensación
      function scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - headerHeight + 10; // 🔧 10px extra margen
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      // Intercepta clicks en todos los enlaces internos
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            scrollToSection(id);
          }
        });
      });

      // Si la página carga con hash en la URL (por ejemplo /#productos)
      window.addEventListener('load', () => {
        const hash = window.location.hash.slice(1);
        if (hash) {
          setTimeout(() => scrollToSection(hash), 300);
        }
      });
      })();
      

  } // fin initAll()

  // Inicialización segura
  document.addEventListener('DOMContentLoaded', initAll);
  window.addEventListener('load', initAll);
  
})();


/* ============================================================
   🌈 ANIME.JS EFFECTS (MODULAR Y PERSONALIZABLE)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // Utilidad para detectar visibilidad (sin ScrollTrigger)
  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
  };

  /* ===================== HERO EFFECT ===================== */
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const art = hero.querySelector(".hero__art img");
  const text = hero.querySelector(".hero__text");
  const title = hero.querySelector(".hero__text h1");
  const subtitle = hero.querySelector(".hero__text p");
  const cta = hero.querySelector(".hero__cta");

  if (!art || !text || !title) return; // seguridad

  // Divide texto solo si no está ya envuelto
  if (title && !title.querySelector(".letter")) {
    const cleanText = title.textContent.trim();
    title.innerHTML = cleanText.replace(/\S/g, "<span class='letter'>$&</span>");
  }

  // Reset inicial
  anime.set([art, text], { opacity: 0 });
  anime.set(".hero__text .letter", { opacity: 0, translateY: 20 });
  const tl = anime.timeline({ easing: "easeOutExpo" });
  const headline = document.querySelector('.hero__text h1');
  if (headline) {
    headline.style.wordBreak = 'keep-all';
    headline.style.hyphens = 'none';
  }

  // 1️⃣ Hero art aparece
  tl.add({
    targets: art,
    opacity: [0, 1],
    scale: [1.9, 1],
    duration: 1800,
    filter: ["blur(12px)", "blur(0px)"],
    easing: "easeOutCubic",
  })

  // 2️⃣ Hero art desaparece con blur
  .add({
    targets: art,
    opacity: [1, 0],
    scale: [1, 1.5],
    filter: ["blur(0px)", "blur(10px)"], // 🔥 efecto cinematográfico
    duration: 1200,
    easing: "easeInCubic",
    delay: 500,
    complete: () => {
      art.style.visibility = "hidden"; // deja de tapar el texto
    }
  })

  // 3️⃣ Aparece texto principal
  .add({
    targets: ".hero__text .letter",
    translateY: [0, 0],
    opacity: [0, 1],
    delay: anime.stagger(30, { start: 200 }),
    duration: 1500,
    begin: () => text.classList.add("visible"),
  }, "-=00")

  // 4️⃣ Subtítulo y botón
  .add({
    targets: [cta],
    opacity: [0, 1],
    translateY: [40, 0],
    duration: 600,
    delay: anime.stagger(20),
  }, "-=100");

  /* ===================== FEATURES ===================== */
  const features = document.querySelectorAll(".features .card");
  if (features.length) {
    window.addEventListener("scroll", () => {
      if (isInViewport(features[0])) {
        features.forEach((card, i) => {
          anime({
            targets: card,
            opacity: [0, 1],
            translateY: [40, 0],
            delay: i * 150,
            duration: 800,
            easing: "easeOutElastic(1, .7)"
          });
        });
      }
    }, { once: true });
  }

  /* ===================== CLIENTES ===================== */
  const clients = document.querySelectorAll(".clientes .card");
  if (clients.length) {
    window.addEventListener("scroll", () => {
      if (isInViewport(clients[0])) {
        anime({
          targets: clients,
          opacity: [0, 1],
          translateY: [50, 0],
          delay: anime.stagger(100, { from: "center" }),
          easing: "easeOutCubic",
          duration: 900
        });
      }
    }, { once: true });
  }

  /* ===================== PRODUCTOS ===================== */
  const products = document.querySelectorAll(".productos .card");
  if (products.length) {
    const center = Math.floor(products.length / 2);
    window.addEventListener("scroll", () => {
      if (isInViewport(products[0])) {
        products.forEach((card, i) => {
          const offset = (i - center) * 60;
          anime({
            targets: card,
            opacity: [0, 1],
            translateX: [0, offset],
            rotateZ: [(i - center) * 6, 0],
            translateY: [40, 0],
            duration: 900,
            delay: i * 120,
            easing: "easeOutCubic"
          });
        });
      }
    }, { once: true });
  }

  /* ===================== CONTACTO ===================== */
  const contact = document.querySelector(".contacto, #contacto");
  if (contact) {
    window.addEventListener("scroll", () => {
      if (isInViewport(contact)) {
        anime({
          targets: contact,
          opacity: [0, 1],
          translateY: [60, 0],
          easing: "easeOutCubic",
          duration: 1000
        });
      }
    }, { once: true });
  }

});
console.log("Hamburger ready:", document.querySelector('.hamburger'));
console.log("Drawer ready:", document.getElementById('mobile-drawer'));
/* ---------- Mobile drawer robust attach (final) ---------- */
(function(){
  function bindHamburger() {
    const hb = document.querySelector('.hamburger');
    const dr = document.getElementById('mobile-drawer');
    if (!hb || !dr) {
      console.warn('bindHamburger: missing elements', { hb, dr });
      return false;
    }
    if (hb.dataset.menuBound === '1') {
      console.log('bindHamburger: already bound');
      return true;
    }
    hb.dataset.menuBound = '1';
    hb.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dr.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      hb.setAttribute('aria-expanded', String(isOpen));
      dr.setAttribute('aria-hidden', String(!isOpen));
      console.log('hamburger toggled =>', isOpen);
    });
    // close on backdrop click
    dr.addEventListener('click', (ev) => { if (ev.target === dr) { dr.classList.remove('open'); hb.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); }});
    // close on esc
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && dr.classList.contains('open')) { dr.classList.remove('open'); hb.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); }});
    // close on link click
    dr.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => { dr.classList.remove('open'); hb.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); }));
    console.log('bindHamburger: bound successfully');
    return true;
  }

  // try immediately
  if (!bindHamburger()) {
    // observe changes if not bound yet
    const observer = new MutationObserver(() => {
      if (bindHamburger()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
