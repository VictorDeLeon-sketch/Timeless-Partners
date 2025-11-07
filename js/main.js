/* ============================================================
   TIMELESS PARTNERS — main.js (versión optimizada y documentada)
   ------------------------------------------------------------
   - Mantiene TODAS las funciones originales (comentadas)
   - Agrega nuevos efectos con Anime.js
   - Cada bloque está documentado para personalización
   ============================================================ */

(function() {
  // ============================================================
  // Flags de control
  // initDone = false -> aún NO inicializado
  // ============================================================
  let heroPlayed = false;
  let initDone = false; // <-- CORRECCIÓN: inicialmente false

  // small helper safe wrapper
  function safe(fn) { try { fn && fn(); } catch (e) { console.error('Safe wrapper error:', e); } }

  // debounce util
  function debounce(fn, wait = 120) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); };
  }

  // ============================================================
  // Scroll helper robusto: usa scrollIntoView + compensación header
  // ============================================================
  function getHeaderHeight() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
  }

  function scrollToSectionById(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    // Preferimos usar CSS scroll-margin-top si está disponible:
    // Si el elemento tiene scrollMarginTop definido por CSS, scrollIntoView respetará el espacio.
    // Para soportar todos los casos, hacemos scrollIntoView y luego compensamos con scrollBy.
    const headerHeight = getHeaderHeight();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Compensación pequeña después de iniciar el scroll: (ajuste -10px)
    window.setTimeout(() => {
      window.scrollBy({ top: -Math.max(0, headerHeight - 10), left: 0, behavior: 'smooth' });
    }, 40); // timeout corto para que el navegador haga el scroll inicial
  }

  // ============================================================
  // Inicialización central
  // ============================================================
  function initAll() {
    if (initDone) return;    // evita doble inicialización
    initDone = true;         // marca que ya inicializamos

    // = AOS ===============
    if (window.AOS) {
      AOS.init({
        duration: 900,
        once: false,
        mirror: true,
        offset: 40,
        easing: 'ease-out-cubic'
      });
    }

    // = Año footer =========
    safe(() => {
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    });

    // = Menú móvil (hamburger + drawer) =
    safe(() => {
      // usamos querySelectors y comprobamos existencia
      const hamburger = document.querySelector('.hamburger');
      const drawer = document.getElementById('mobile-drawer');

      if (!hamburger || !drawer) {
        console.warn("Menú móvil no encontrado (.hamburger o #mobile-drawer).");
      } else {
        // aseguramos no añadir listeners duplicados
        // quitamos listeners previos si existen (defensivo)
        hamburger.replaceWith(hamburger.cloneNode(true));
        const hamburgerFresh = document.querySelector('.hamburger');

        // toggle
        function toggleDrawer() {
          const isOpen = drawer.classList.toggle('open');
          hamburgerFresh.setAttribute('aria-expanded', String(isOpen));
          document.body.classList.toggle('menu-open', isOpen);
        }

        hamburgerFresh.addEventListener('click', toggleDrawer);

        drawer.addEventListener('click', (e) => {
          // cerrar al clickar en overlay o en enlace
          if (e.target === drawer || e.target.tagName === 'A') {
            drawer.classList.remove('open');
            hamburgerFresh.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
          }
        });
      }
    });

    // = Formulario de contacto =
    safe(() => {
      const form = document.getElementById('contactForm');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // limpia errores
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

        if (!data.nombre || data.nombre.trim().length < 2) { setError('nombre', 'Ingresa tu nombre (mínimo 2 caracteres).'); hasError = true; }
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError('email', 'Ingresa un correo electrónico válido.'); hasError = true; }
        if (!data.mensaje || data.mensaje.trim().length < 10) { setError('mensaje', 'Cuéntanos un poco más (mínimo 10 caracteres).'); hasError = true; }
        if (hasError) return;

        try {
          await new Promise(r => setTimeout(r, 600));
          alert('¡Gracias! Hemos recibido tu mensaje.');
          form.reset();
        } catch (err) {
          alert('Hubo un problema al enviar tu mensaje. Intenta de nuevo.');
        }
      });
    });

    // = Smooth section navigation =
    safe(() => {
      // recalcula headerHeight cuando cambie el tamaño
      const onResize = debounce(() => {
        // nada extra aquí, getHeaderHeight() leerá siempre la altura actual
      }, 120);
      window.addEventListener('resize', onResize);

      // intercepta clicks de enlaces internos (ej. <a href="#servicios">)
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href.length < 2) return;
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            // Si el drawer está abierto (mobile) cerrarlo
            const drawer = document.getElementById('mobile-drawer');
            if (drawer && drawer.classList.contains('open')) {
              drawer.classList.remove('open');
              document.querySelector('.hamburger')?.setAttribute('aria-expanded','false');
            }
            scrollToSectionById(id);
          }
        });
      });

      // Si al cargar la página existe hash en URL, desplazamos en load
      window.addEventListener('load', () => {
        const hash = window.location.hash.slice(1);
        if (hash) {
          // pequeño delay para dejar que imágenes y fuentes se pinten
          setTimeout(() => scrollToSectionById(hash), 220);
        }
      });
    });

    // = opcional: aplicar scroll-margin-top via JS a secciones si no lo tienes en CSS =
    safe(() => {
      const headerHeight = getHeaderHeight();
      document.querySelectorAll('section[id]').forEach(sec => {
        // preferimos dejar a CSS, pero aplicamos por si acaso (valor en px)
        sec.style.scrollMarginTop = `${Math.max(10, headerHeight + 8)}px`;
      });
      // Reaplicar en resize
      window.addEventListener('resize', debounce(() => {
        const hh = getHeaderHeight();
        document.querySelectorAll('section[id]').forEach(sec => {
          sec.style.scrollMarginTop = `${Math.max(10, hh + 8)}px`;
        });
      }, 200));
    });

    // Fin initAll
    console.log('initAll completed');
  } // end initAll

  // Inicializa de forma segura: DOMContentLoaded y Load no duplicarán la init
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

  if (!art || !text || !title) return; // 🔒 seguridad

  // =====================================================
  // 🔠 1️⃣ Divide el texto en PALABRAS (no letras)
  // =====================================================
  if (title && !title.querySelector(".word")) {
    const cleanText = title.textContent.trim();
    const words = cleanText.split(/\s+/); // divide por espacios
    title.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  }

  // =====================================================
  // ⚙️ 2️⃣ Reset inicial (todo invisible antes de animar)
  // =====================================================
  anime.set([art, text], { opacity: 0 });
  anime.set(".hero__text .word", { opacity: 0, translateY: 20 });

  const tl = anime.timeline({ easing: "easeOutExpo" });

  // Mejoras visuales de texto
  const headline = document.querySelector('.hero__text h1');
  if (headline) {
    headline.style.wordBreak = 'keep-all';
    headline.style.hyphens = 'none';
    headline.style.whiteSpace = 'normal';
  }

  // =====================================================
  // 🎬 3️⃣ Hero art aparece primero con blur cinematográfico
  // =====================================================
  tl.add({
    targets: art,
    opacity: [0, 1],
    scale: [1.9, 1],
    duration: 1000,
    filter: ["blur(12px)", "blur(0px)"],
    easing: "easeOutCubic",
  })

  // =====================================================
  // 🎞️ 4️⃣ Hero art desaparece con blur
  // =====================================================
  .add({
    targets: art,
    opacity: [1, 0],
    scale: [1, 1.5],
    filter: ["blur(0px)", "blur(10px)"],
    duration: 1000,
    easing: "easeInCubic",
    delay: 500,
    complete: () => {
      art.style.visibility = "hidden"; // deja de tapar el texto
    }
  })

  // =====================================================
  // ✨ 5️⃣ Aparece el texto principal PALABRA POR PALABRA
  // =====================================================
  .add({
    targets: ".hero__text .word",
    translateY: [40, 0],
    opacity: [0, 1],
    delay: anime.stagger(220, { start: 200 }), // 🔥 retrasa cada palabra
    duration: 1000,
    begin: () => text.classList.add("visible"),
  }, "-=200")

  // =====================================================
  // 🎯 6️⃣ Subtítulo y botón con entrada suave
  // =====================================================
  .add({
    targets: [cta],
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    delay: anime.stagger(150),
  }, "-=600");

  // =====================================================
  // 🌊 7️⃣ (Opcional) Pulso suave en la imagen
  // =====================================================
  anime({
    targets: art,
    scale: [1, 1.03],
    easing: "easeInOutSine",
    direction: "alternate",
    duration: 4000,
    loop: true,
    autoplay: true,
  });

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
