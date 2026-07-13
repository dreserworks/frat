/* ============================================================
   FRAT — Creative Experiences Lab · app.js
   Motor de interacción (vanilla JS, sin dependencias):
   01 Menú fullscreen
   02 Transiciones de página (veil cinematográfico)
   03 Scroll reveals con stagger y easing custom
   04 Marquees infinitos (credenciales + muro de marcas)
   05 Preview flotante que sigue el cursor
   06 Parallax ligero (hero, This is Frat, héroes de Lab)
   ============================================================ */
(function () {
  'use strict';

  var EASE_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var POINTER_FINE = window.matchMedia('(pointer: fine)').matches;

  /* ----------------------------------------------------------
     01 · MENÚ FULLSCREEN
     Home: el logo (perrito) abre. Internas: botón "Menu" (móvil).
     Cierra: CLOSE, Escape o clic fuera del panel.
     ---------------------------------------------------------- */
  var menu = document.querySelector('.menu-fullscreen');
  if (menu) {
    var logo = document.querySelector('.topbar .brandlogo');
    var menuBtn = document.querySelector('.topbar .menu-btn');
    var closeBtn = menu.querySelector('.close-btn');
    var catcher = menu.querySelector('.menu-catcher');

    var openMenu = function () {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeMenu = function () {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (logo && logo.getAttribute('href') === '#') {
      logo.addEventListener('click', function (e) { e.preventDefault(); openMenu(); });
    }
    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (catcher) catcher.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ----------------------------------------------------------
     02 · TRANSICIONES DE PÁGINA
     Cortina negra que cubre al salir y descubre al entrar.
     ---------------------------------------------------------- */
  var veil = document.createElement('div');
  veil.className = 'veil on';
  document.body.appendChild(veil);

  /* entrada: descubrir la página */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { veil.classList.remove('on'); });
  });
  /* al volver desde bfcache */
  window.addEventListener('pageshow', function () { veil.classList.remove('on'); });

  /* salida: cubrir y navegar */
  document.addEventListener('click', function (e) {
    if (EASE_REDUCED) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
    if (/^(https?:|mailto:|tel:)/.test(href) && a.host !== location.host) return;
    e.preventDefault();
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
    veil.classList.add('on');
    setTimeout(function () { location.href = href; }, 640);
  });

  /* ----------------------------------------------------------
     03 · SCROLL REVEALS
     Auto-etiqueta los elementos clave y los revela con stagger.
     ---------------------------------------------------------- */
  var REVEAL_SELECTORS = [
    '.this-frat .head', '.this-frat .lead-strong', '.this-frat .lead-sub', '.tf-media',
    '.cred-title', '.ff-head .ff-kicker', '.ff-head h2',
    '.labfrat .label', '.labfrat .list a', '.labfrat .img',
    '.contact-foot .band',
    '.lab-hero', '.flagship h2', '.flagship .tags', '.flagship .lead',
    '.lab-intro h2', '.lab-intro .tags', '.lab-intro .lead',
    '.offer-3col > *', '.feature > *',
    '.hl-head', '.hl-card', '.hl-zone .center',
    '.svc-kicker', '.svc-item', '.svc-foot',
    '.page-title', '.page-sub', '.work-card',
    '.proj-title-row', '.proj-meta', '.proj-hero .img',
    '.about .label', '.about .lead',
    '.awards .img', '.awards .txt',
    '.gallery-head', '.gallery-masonry .img',
    '.contact-split .kicker', '.contact-split .c-title', '.c-meta', '.c-form'
  ];

  if (!EASE_REDUCED && 'IntersectionObserver' in window) {
    var seen = [];
    REVEAL_SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen.indexOf(el) !== -1) return;
        seen.push(el);
        el.setAttribute('data-rvl', '');
      });
    });

    /* stagger: retraso incremental entre hermanos revelables */
    document.querySelectorAll('[data-rvl]').forEach(function (el) {
      var i = 0, sib = el;
      while ((sib = sib.previousElementSibling)) {
        if (sib.hasAttribute('data-rvl')) i++;
      }
      el.style.setProperty('--rd', Math.min(i * 0.09, 0.55) + 's');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('[data-rvl]').forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
     04 · MARQUEES INFINITOS
     Duplica el contenido hasta cubrir 2× el ancho visible:
     la animación translateX(-50%) hace el loop perfecto.
     ---------------------------------------------------------- */
  function setupMarquee(m) {
    if (m.dataset.mqReady) return;
    var track = m.querySelector('.mq-track');
    if (!track || !track.children.length) return;
    m.dataset.mqReady = '1';
    var originals = Array.prototype.slice.call(track.children);
    var guard = 0;
    while (track.scrollWidth < m.offsetWidth * 1.05 && guard < 24) {
      originals.forEach(function (n) { track.appendChild(n.cloneNode(true)); });
      guard++;
    }
    /* segunda mitad idéntica para el loop al 50% */
    Array.prototype.slice.call(track.children).forEach(function (n) {
      track.appendChild(n.cloneNode(true));
    });
    track.style.setProperty('--dur', (parseFloat(m.dataset.speed) || 40) + 's');
  }

  /* Los muros de marcas se inicializan DESPUÉS de normalizar los logos
     (módulo 04b), para clonar ya con los tamaños ópticos correctos. */
  document.querySelectorAll('[data-marquee]').forEach(function (m) {
    if (m.classList.contains('brand-row')) return;
    setupMarquee(m);
  });

  /* ----------------------------------------------------------
     04b · NORMALIZACIÓN ÓPTICA DE LOGOS (Friends & Family)
     Cada PNG/WebP puede traer márgenes transparentes distintos.
     Para equilibrar la composición NO usamos el bounding box del
     archivo: recortamos el contenido real (alpha) y escalamos cada
     logo a un ÁREA ÓPTICA equivalente (masa visual), con topes de
     alto/ancho. Así todos pesan visualmente lo mismo.
     ---------------------------------------------------------- */
  (function () {
    var brandRows = Array.prototype.slice.call(document.querySelectorAll('.brand-row'));
    if (!brandRows.length) return;

    var small = window.matchMedia('(max-width: 900px)').matches;
    var K = small ? 0.82 : 1;
    var AOPT = 2750 * K;     // área óptica objetivo (px² del contenido renderizado)
    var HMIN = 18 * K, HMAX = 46 * K, WMAX = 160 * K;
    var ALPHA = 24;         // umbral de opacidad para detectar contenido

    var cache = {};         // src -> { url, aspect }

    function analyze(src) {
      if (cache[src]) return Promise.resolve(cache[src]);
      return new Promise(function (resolve) {
        var im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = function () {
          var nw = im.naturalWidth, nh = im.naturalHeight;
          if (!nw || !nh) return resolve(null);
          var SCAN = 220, sc = Math.min(1, SCAN / Math.max(nw, nh));
          var sw = Math.max(1, Math.round(nw * sc)), sh = Math.max(1, Math.round(nh * sc));
          var c = document.createElement('canvas'); c.width = sw; c.height = sh;
          var cx2 = c.getContext('2d'); cx2.drawImage(im, 0, 0, sw, sh);
          var data;
          try { data = cx2.getImageData(0, 0, sw, sh).data; } catch (e) { return resolve(null); }
          var minX = sw, minY = sh, maxX = -1, maxY = -1;
          for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
              if (data[(y * sw + x) * 4 + 3] > ALPHA) {
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
              }
            }
          }
          if (maxX < 0) return resolve(null);
          var cw = (maxX - minX + 1) / sc, ch = (maxY - minY + 1) / sc;
          var ox = minX / sc, oy = minY / sc;
          var tc = document.createElement('canvas');
          tc.width = Math.max(1, Math.round(cw)); tc.height = Math.max(1, Math.round(ch));
          tc.getContext('2d').drawImage(im, ox, oy, cw, ch, 0, 0, tc.width, tc.height);
          var url;
          try {
            url = tc.toDataURL('image/webp', 0.92);
            if (url.indexOf('image/webp') < 0) url = tc.toDataURL('image/png');
          } catch (e) { url = null; }
          var out = { url: url, aspect: cw / ch };
          cache[src] = out; resolve(out);
        };
        im.onerror = function () { resolve(null); };
        im.src = src;
      });
    }

    function sizeFor(aspect) {
      var h = Math.sqrt(AOPT / aspect), w = h * aspect;
      if (h > HMAX) { h = HMAX; w = h * aspect; }   // logo compacto: limita alto
      if (h < HMIN) { h = HMIN; w = h * aspect; }   // logo fino: sube alto…
      if (w > WMAX) { w = WMAX; h = w / aspect; }   // …pero el tope de ANCHO manda
      return { w: Math.round(w), h: Math.round(h) };
    }

    /* COMPENSACIÓN ÓPTICA (2º pase): logos que se perciben pequeños por
       sus márgenes/proporciones reciben un realce sutil POSTERIOR a la
       normalización. Benchmark de tamaño correcto: Absolut, Zara Home, ELA. */
    /* valor = multiplicador de ÁREA (se aplica su raíz a cada lado → sutil) */
    var BOOSTS = {
      'CONSUMO-161': 1.18,        // Pepsi
      'CONSUMO-154': 1.32,        // Johnnie Walker (emblema)
      'CONSUMO-167': 1.32,        // Glucloud (emblema)
      'CONSUMO-163': 1.18,        // Chivas Regal
      'CONSUMO-182': 1.16,        // Delirio
      'RETAIL-115': 1.22,         // Jardín Plaza
      'RETAIL-175': 1.18,         // Claro Música
      'RETAIL-181': 1.16,         // Dollarcity
      'RETAIL-186': 1.32,         // Laika (emblema)
      'CORPORACIONES-119': 1.34,  // Gobernación del Valle (escudo)
      'CORPORACIONES-120': 1.22,  // Corfecali
      'CORPORACIONES-122': 1.30,  // Healthy America (emblema)
      'CORPORACIONES-123': 1.18,  // TANGA (TNG)
      'CORPORACIONES-125': 1.18,  // Winny
      'CORPORACIONES-184': 1.20,  // Vitane
      'CORPORACIONES-185': 1.22   // Muss
    };
    function boostFor(src) {
      var s = decodeURIComponent(src || '');
      var m = s.match(/brands\/([^/]+)\/Recurso\s*(\d+)/i);
      if (!m) return 1;
      return BOOSTS[m[1].toUpperCase() + '-' + m[2]] || 1;
    }
    var BOOST_HMAX = HMAX * 1.35;   // techo de alto para logos realzados (≈62px)
    /* tamaño dedicado para logos realzados: apunta directo al área
       objetivo*boost, con techo de alto/ancho ampliado (no parte del
       tamaño ya topado, así los emblemas cuadrados sí crecen). */
    function sizeForBoost(aspect, b) {
      var A = AOPT * b;
      var h = Math.sqrt(A / aspect), w = h * aspect;
      if (h > BOOST_HMAX) { h = BOOST_HMAX; w = h * aspect; }
      if (h < HMIN) { h = HMIN; w = h * aspect; }
      if (w > WMAX * 1.12) { w = WMAX * 1.12; h = w / aspect; }
      return { w: Math.round(w), h: Math.round(h) };
    }

    var imgs = [];
    brandRows.forEach(function (r) {
      Array.prototype.slice.call(r.querySelectorAll('.brand-slot img')).forEach(function (i) { imgs.push(i); });
    });

    Promise.all(imgs.map(function (img) {
      var origSrc = img.getAttribute('src');
      return analyze(origSrc).then(function (r) {
        if (!r) return;
        if (r.url) img.src = r.url;
        var b = boostFor(origSrc);
        var s = (b !== 1) ? sizeForBoost(r.aspect, b) : sizeFor(r.aspect);
        img.style.width = s.w + 'px';
        img.style.height = s.h + 'px';
        img.style.objectFit = 'fill';   // ya viene recortado: sin deformación
      });
    })).then(function () {
      brandRows.forEach(setupMarquee);
    });
  })();

  /* ----------------------------------------------------------
     05 · PREVIEW FLOTANTE QUE SIGUE EL CURSOR
     Imagen contextual (placeholder documentado) al pasar sobre
     servicios (lab.html), proyectos, highlights y credenciales.
     NOTA: la sección Services de la Home (.labfrat) queda EXCLUIDA
     a propósito — usa su propio contenedor de preview (módulo 05b).
     ---------------------------------------------------------- */
  if (POINTER_FINE && !EASE_REDUCED) {
    var cp = document.createElement('div');
    cp.className = 'cursor-prev';
    cp.innerHTML = '<div class="cp-in"><div class="ph" data-label=""></div></div>';
    document.body.appendChild(cp);
    var cpLabel = cp.querySelector('.ph');

    var mx = innerWidth / 2, my = innerHeight / 2, px = mx, py = my;

    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

    (function loop() {
      /* lerp: persecución suave del cursor */
      px += (mx - px) * 0.14;
      py += (my - py) * 0.14;
      cp.style.transform = 'translate3d(' + (px + 26) + 'px,' + (py - cp.offsetHeight * 0.55) + 'px,0)';
      requestAnimationFrame(loop);
    })();

    /* .labfrat .list a y .cred-card NO están aquí:
       la Home usa contenedor propio / las credenciales no llevan preview */
    var HOVER_TARGETS = '.svc-item, .work-card, .hl-card';
    document.querySelectorAll(HOVER_TARGETS).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var label = el.dataset.preview;
        if (!label) {
          var nameEl = el.querySelector('.name, .t') || el;
          label = 'Preview: ' + nameEl.textContent.replace(/\s+/g, ' ').replace('→', '').trim();
        }
        cpLabel.setAttribute('data-label', label);
        cp.classList.add('on');
      });
      el.addEventListener('mouseleave', function () {
        cp.classList.remove('on');
      });
    });
  }

  /* ----------------------------------------------------------
     05b · PREVIEW LAB FRAT — Home Services (contenedor derecho)
     El hover de cada servicio activa su imagen dentro del único
     contenedor de preview; al salir se restaura la imagen default.
     Ninguna imagen sigue al cursor en esta sección.
     ---------------------------------------------------------- */
  var lfPreview = document.querySelector('[data-lf-preview]');
  if (lfPreview) {
    var lfSlides = lfPreview.querySelectorAll('.lf-slide');
    var lfShow = function (svc) {
      lfSlides.forEach(function (s) {
        s.classList.toggle('is-active', s.getAttribute('data-svc') === svc);
      });
    };
    document.querySelectorAll('.labfrat .list a').forEach(function (a) {
      var svc = a.getAttribute('data-svc');
      a.addEventListener('mouseenter', function () { lfShow(svc); });
      a.addEventListener('mouseleave', function () { lfShow('default'); });
      a.addEventListener('focus', function () { lfShow(svc); });
      a.addEventListener('blur', function () { lfShow('default'); });
    });
  }

  /* ----------------------------------------------------------
     06b · FILTRO DE PROYECTOS (work.html)
     Cross-fade del grid: oculta el contenido, reordena por
     categoría y vuelve a aparecer. Conserva hover y animaciones.
     ---------------------------------------------------------- */
  var workGrid = document.querySelector('.work-grid');
  var filterBtns = document.querySelectorAll('.work-filters .wf');
  if (workGrid && filterBtns.length) {
    var workCards = Array.prototype.slice.call(workGrid.querySelectorAll('.work-card'));
    var emptyMsg = document.querySelector('.work-empty');

    var runFilter = function (cat) {
      workGrid.classList.add('is-filtering');
      setTimeout(function () {
        var visible = 0;
        workCards.forEach(function (c) {
          var match = cat === 'all' || c.dataset.cat === cat;
          c.style.display = match ? '' : 'none';
          if (match) visible++;
        });
        if (emptyMsg) emptyMsg.hidden = visible !== 0;
        workGrid.classList.remove('is-filtering');
      }, 300);
    };

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('active')) return;
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        runFilter(btn.dataset.filter);
      });
    });
  }

  /* ----------------------------------------------------------
     06c · FORMULARIO DE CONTACTO
     Sin backend: evita la recarga y da feedback dentro de la paleta.
     ---------------------------------------------------------- */
  var cForm = document.querySelector('.c-form');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = cForm.querySelector('.fsubmit');
      if (!btn || btn.dataset.sent) return;
      btn.dataset.sent = '1';
      var label = btn.querySelector('.fs-label');
      if (label) label.textContent = 'Mensaje enviado';
      btn.classList.add('is-sent');
    });
  }

  /* ----------------------------------------------------------
     06d · BACK TO TOP (flotante, con anillo de progreso de scroll)
     Oculto al cargar; aparece tras un scroll suficiente; el anillo
     se completa al llegar al final; clic = scroll suave al inicio.
     ---------------------------------------------------------- */
  (function () {
    var R = 24;                       // radio del círculo (viewBox 0 0 52 52, cx/cy 26)
    var C = 2 * Math.PI * R;          // circunferencia
    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML =
      '<svg class="tt-ring" viewBox="0 0 52 52" aria-hidden="true">' +
        '<circle class="tt-track" cx="26" cy="26" r="' + R + '"></circle>' +
        '<circle class="tt-prog" cx="26" cy="26" r="' + R + '" ' +
          'stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + C.toFixed(2) + '"></circle>' +
      '</svg>' +
      '<svg class="tt-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M12 20V5"></path><path d="M5 12l7-7 7 7"></path>' +
      '</svg>';
    document.body.appendChild(btn);

    var prog = btn.querySelector('.tt-prog');
    var SHOW_AT = 500;                 // px de scroll mínimos para aparecer
    var ticking = false;

    var update = function () {
      ticking = false;
      var doc = document.documentElement;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var y = window.scrollY || doc.scrollTop;
      var ratio = Math.min(1, Math.max(0, y / max));
      prog.style.strokeDashoffset = (C * (1 - ratio)).toFixed(2);
      btn.classList.toggle('show', y > SHOW_AT);
    };

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: EASE_REDUCED ? 'auto' : 'smooth' });
    });

    update();
  })();

  /* ----------------------------------------------------------
     06 · PARALLAX LIGERO
     Capas que se desplazan a velocidades distintas al hacer scroll.
     ---------------------------------------------------------- */
  if (!EASE_REDUCED) {
    var plxItems = [];
    var lockup = document.querySelector('.home-hero .hero-lockup');
    var heroBg = document.querySelector('.home-hero .bg');
    var tfImg = document.querySelector('.tf-media .img');
    if (lockup) plxItems.push({ el: lockup, speed: 0.16, mode: 'scroll', base: 'translateY(-50%)' });
    if (heroBg) plxItems.push({ el: heroBg, speed: 0.10, mode: 'scroll', base: '' });
    if (tfImg) plxItems.push({ el: tfImg, speed: 0.10, mode: 'center', base: '' });
    document.querySelectorAll('.lab-hero .img').forEach(function (el) {
      plxItems.push({ el: el, speed: 0.06, mode: 'center', base: '' });
    });

    if (plxItems.length) {
      var ticking = false;
      var applyPlx = function () {
        ticking = false;
        var vh = innerHeight;
        plxItems.forEach(function (it) {
          var y;
          if (it.mode === 'scroll') {
            y = scrollY * it.speed;
          } else {
            var r = it.el.getBoundingClientRect();
            y = (r.top + r.height / 2 - vh / 2) * -it.speed;
          }
          it.el.style.transform = it.base + ' translate3d(0,' + y.toFixed(1) + 'px,0)';
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(applyPlx); }
      }, { passive: true });
      applyPlx();
    }
  }
})();
