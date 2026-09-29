/* ==========================================================================
   KAGURA · CHROME + COMPONENTES COMPARTIDOS
   Todas las páginas cargan este archivo. El chrome (píldora superior, barra
   inferior móvil, pie, overlay de búsqueda, scroll-top) se inyecta desde aquí
   para que exista una sola copia del marcado.
   La página activa se marca con  <body data-page="home|nuevos|...">
   ========================================================================== */
(function () {
  "use strict";

  var NAV = [
    {id:"home",     label:"Inicio",    href:"index.html"},
    {id:"nuevos",   label:"Novedades", href:"nuevos.html"},
    {id:"populares",label:"Populares", href:"tendencias.html"},
    {id:"generos",  label:"Géneros",   href:"generos.html"},
    {id:"comunidad",label:"Comunidad", href:"comunidad.html"},
    {id:"milista",  label:"Mi lista",  href:"mi-lista.html"}
  ];

  var BOTTOM = [
    {id:"home",      label:"Inicio",     href:"index.html",     d:"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"},
    {id:"populares", label:"Tendencias", href:"tendencias.html",d:"M3 17l5-5 4 4 8-8M16 8h4v4"},
    {id:"buscar",    label:"Buscar",     href:"#",              d:"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5", search:true},
    {id:"comunidad",label:"Fans",       href:"comunidad.html",d:"M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 2.5-5 6-5s6 2 6 5M11 20c0-3 2-5 5-5s6 2 6 5"},
    {id:"calendario",label:"Calendario", href:"calendario.html",d:"M5 5h14v16H5zM3 11h18M8 3v4M16 3v4"},
    {id:"perfil",    label:"Perfil",     href:"perfil.html",    d:"M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 3.6-6 8-6s8 2 8 6"}
  ];

  var FOOTER_COLS = [
    {t:"Explorar", l:[["Inicio","index.html"],["Novedades","nuevos.html"],["Populares","tendencias.html"],["Géneros","generos.html"],["Calendario","calendario.html"]]},
    {t:"Cuenta",   l:[["Entrar o registrarse","acceso.html"],["Mi perfil","perfil.html"],["Comunidad","comunidad.html"],["Mi lista","mi-lista.html"]]},
    {t:"Ayuda",    l:[["Centro de ayuda","#"],["Dispositivos","#"],["Contacto","#"],["Estado del servicio","#"]]},
    {t:"Legal",    l:[["Términos","#"],["Privacidad","#"],["Cookies","#"],["Aviso legal","#"]]}
  ];

  var ico = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bell:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    star:   '<svg viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    play:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12z"/></svg>',
    plus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
    left:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    right:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    down:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    up:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    trend:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 4 8-8M16 8h4v4"/></svg>'
  };

  /* ── util ─────────────────────────────────────────────────────────────── */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function href(key) { return "anime.html?id=" + key; }
  function watchHref(key, ep) { return "watch.html?id=" + key + (ep ? "&ep=" + ep : ""); }
  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ── tarjeta de póster ────────────────────────────────────────────────── */
  function card(key) {
    var a = A[key];
    return '<a class="poster-link" href="' + href(key) + '" aria-label="' + a.t + '">' +
      '<div class="poster-frame">' +
        '<img src="' + IMG + a.p + '" alt="Póster de ' + a.t + '" loading="lazy">' +
        '<div class="poster-frame__scrim"></div>' +
        '<div class="poster-badges">' +
          '<span class="badge-format">' + a.f + '</span>' +
          (a.s ? '<span class="badge-score">' + ico.star + a.s + '</span>' : '') +
        '</div>' +
        (a.live ? '<span class="badge-live"><i></i>LIVE</span>' : '') +
        /* capa de hover deliberadamente vacía: el disco de play es antipatrón */
        '<div class="poster-frame__hover"></div>' +
      '</div>' +
      '<div class="poster-meta"><h3>' + a.t + '</h3><p>' + a.g.join(" · ") + '</p></div>' +
    '</a>';
  }

  /* variante de rejilla: el título vive dentro del arte (anatomía rankings) */
  function gridCard(key, rank) {
    var a = A[key];
    return '<a class="poster-link" href="' + href(key) + '" aria-label="' + a.t + '">' +
      '<div class="poster-frame">' +
        '<img src="' + IMG + a.p + '" alt="Póster de ' + a.t + '" loading="lazy">' +
        '<div class="poster-frame__scrim"></div>' +
        '<div class="poster-badges">' +
          '<span class="badge-format">' + a.f + '</span>' +
          (a.s ? '<span class="badge-score">' + ico.star + a.s + '</span>' : '') +
        '</div>' +
        (rank ? '<span class="poster-frame__rank' + (rank <= 3 ? ' poster-frame__rank--top' : '') + '">' + (rank < 10 ? "0" : "") + rank + '</span>' : '') +
        '<h3 class="poster-frame__title"' + (rank ? ' style="padding-left:1.5rem"' : '') + '>' + a.t + '</h3>' +
        '<div class="poster-frame__hover"></div>' +
      '</div>' +
    '</a>';
  }

  /* ── género ───────────────────────────────────────────────────────────── */
  /* el arte no está hardcodeado: sale del catálogo. Reparto en dos pasadas
     para que cada género enseñe una serie distinta — si no, Frieren sale en
     Aventura, Drama y Fantasía a la vez. Prioridad:
       1) sin usar y con banner (arte apaisado, encaja en una tarjeta ancha)
       2) sin usar, con póster
       3) repetir el mejor del género si ya no queda nada libre */
  var artMap = null;

  function bestOf(pool, used, needBanner) {
    var best = null;
    pool.forEach(function (k) {
      if (used && used[k]) return;
      if (needBanner && !A[k].b) return;
      if (!best || A[k].s > A[best].s) best = k;
    });
    return best;
  }

  function buildArtMap() {
    var used = {};
    artMap = {};
    GENRES.forEach(function (g) {
      var pool = KEYS.filter(function (k) { return A[k].g.indexOf(g) > -1; });
      if (!pool.length) return;
      var k = bestOf(pool, used, true) || bestOf(pool, used, false) ||
              bestOf(pool, null, true) || bestOf(pool, null, false);
      used[k] = true;
      artMap[g] = IMG + (A[k].b || A[k].p);
    });
  }

  function genreArt(genre) {
    if (!artMap) buildArtMap();
    if (artMap[genre]) return artMap[genre];
    /* género que no está en GENRES (una etiqueta suelta, por ejemplo) */
    var pool = KEYS.filter(function (k) { return A[k].g.indexOf(genre) > -1; });
    if (!pool.length) return null;
    var k = bestOf(pool, null, true) || bestOf(pool, null, false);
    return IMG + (A[k].b || A[k].p);
  }

  function genreCard(genre, i, count, active) {
    var art = genreArt(genre);
    return '<a class="genre-card" style="--genre-index:' + i + '"' +
      ' href="generos.html?g=' + encodeURIComponent(genre) + '"' +
      (active ? ' aria-current="page"' : '') + '>' +
      (art ? '<span class="genre-card__art" style="background-image:url(\'' + art + '\')"></span>' : '') +
      '<span class="genre-card__dot"></span>' +
      '<b>' + genre + '</b>' +
      '<span>' + Number(count).toLocaleString("es") + ' títulos</span>' +
    '</a>';
  }

  /* ── carrusel ─────────────────────────────────────────────────────────── */
  function mountRow(host, opt) {
    host.classList.add("home-row");
    host.innerHTML =
      '<div class="section-head"><div>' +
        '<h2><span class="section-head__accent"></span>' + opt.title + '</h2>' +
        (opt.sub ? '<p>' + opt.sub + '</p>' : '') +
      '</div><div class="home-row__nav">' +
        '<button class="row-arrow" data-dir="-1" aria-label="Desplazar a la izquierda">' + ico.left + '</button>' +
        '<button class="row-arrow" data-dir="1" aria-label="Desplazar a la derecha">' + ico.right + '</button>' +
      '</div></div>' +
      '<div class="home-row__fade home-row__fade--left" hidden></div>' +
      '<div class="home-row__fade home-row__fade--right"></div>' +
      '<div class="home-rail">' + opt.items.map(card).join("") + '</div>';

    var rail = qs(".home-rail", host);
    var fadeL = qs(".home-row__fade--left", host);
    var fadeR = qs(".home-row__fade--right", host);
    var arrows = qsa(".row-arrow", host);

    arrows.forEach(function (btn) {
      btn.addEventListener("click", function () {
        rail.scrollBy({left: rail.clientWidth * 0.8 * Number(btn.dataset.dir), behavior: "smooth"});
      });
    });
    function sync() {
      var max = rail.scrollWidth - rail.clientWidth - 4;
      fadeL.hidden = rail.scrollLeft <= 4;
      fadeR.hidden = rail.scrollLeft >= max;
      arrows[0].disabled = rail.scrollLeft <= 4;
      arrows[1].disabled = rail.scrollLeft >= max;
    }
    rail.addEventListener("scroll", sync, {passive: true});
    window.addEventListener("resize", sync);
    sync();
  }

  /* ── chrome ───────────────────────────────────────────────────────────── */
  function buildHeader(page) {
    return '<header class="site-top-shell"><div class="site-top-pill" id="topPill">' +
      '<a class="site-top-brand" href="index.html" aria-label="Kagura inicio">' +
        '<span class="site-top-brand__mark">K</span>' +
        '<span class="site-top-brand__word">Kagura</span>' +
      '</a>' +
      '<nav class="site-top-tabs" aria-label="Principal">' +
        NAV.map(function (n) {
          return '<a class="site-top-tab' + (n.id === page ? " site-top-tab--active" : "") + '" href="' + n.href + '">' + n.label + '</a>';
        }).join("") +
      '</nav>' +
      '<div class="site-top-actions">' +
        '<button class="site-search-field" data-search-open type="button">' + ico.search + '<span>Buscar anime…</span><kbd>⌘K</kbd></button>' +
        '<div class="accent-dock" role="group" aria-label="Color de acento">' +
          [["255 145 191","Rosa"],["217 158 241","Lavanda"],["255 177 194","Durazno"],["255 212 168","Melocotón"],["250 250 250","Perla"]].map(function (c, i) {
            return '<button class="accent-dot" style="--c:' + c[0] + '" data-accent="' + c[0] + '" aria-label="Acento ' + c[1] + '" aria-pressed="' + (i === 0) + '" title="' + c[1] + '"></button>';
          }).join("") +
        '</div>' +
        '<button class="site-top-icon" data-search-open type="button" aria-label="Buscar">' + ico.search + '</button>' +
        '<button class="site-top-icon" type="button" aria-label="Notificaciones">' + ico.bell + '<span class="site-top-icon__dot"></span></button>' +
        '<a class="nav-avatar" href="perfil.html" aria-label="Perfil">A</a>' +
      '</div>' +
    '</div></header>';
  }

  function buildFooter() {
    return '<footer class="site-footer"><div class="wrap">' +
      '<div class="site-footer__grid">' +
        '<div class="site-footer__brand">' +
          '<a class="site-top-brand" href="index.html"><span class="site-top-brand__mark">K</span><span class="site-top-brand__word">Kagura</span></a>' +
          '<p>Tu universo de anime en streaming. Miles de episodios en HD y 4K, con subtítulos y doblaje. Sin anuncios.</p>' +
        '</div>' +
        FOOTER_COLS.map(function (c) {
          return '<div><h3>' + c.t + '</h3><ul>' + c.l.map(function (l) {
            return '<li><a href="' + l[1] + '">' + l[0] + '</a></li>';
          }).join("") + '</ul></div>';
        }).join("") +
      '</div>' +
      '<div class="site-footer__bottom">' +
        '<p>© ' + new Date().getFullYear() + ' Kagura. Hecho para fans del anime.</p>' +
        '<div class="site-footer__socials">' +
          '<a class="social-btn" data-brand="discord" href="#" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 5.3A16 16 0 0 0 15.4 4l-.2.4a12 12 0 0 1 3.4 1.7 11 11 0 0 0-9.2 0A12 12 0 0 1 12.8 4.4L12.6 4a16 16 0 0 0-3.9 1.3C6 9 5.3 12.6 5.6 16.2a16 16 0 0 0 4.8 2.4l.6-1.5a10 10 0 0 1-1.6-.8l.4-.3a11 11 0 0 0 9.4 0l.4.3a10 10 0 0 1-1.6.8l.6 1.5a16 16 0 0 0 4.8-2.4c.4-4.2-.7-7.8-3-10.9zM9.7 14.2c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9zm4.6 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.7 1.9-1.7 1.9z"/></svg></a>' +
          '<a class="social-btn" data-brand="telegram" href="#" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.4 18.7 19c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6.5 12.6 1.8 11c-1-.3-1-1 .2-1.5l18.4-7.1c.9-.3 1.6.2 1.5 2z"/></svg></a>' +
          '<a class="social-btn" data-brand="patreon" href="#" aria-label="Patreon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.4 3a5.9 5.9 0 1 0 0 11.9A5.9 5.9 0 0 0 15.4 3zM3 21h3.5V3H3z"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</div></footer>';
  }

  function buildBottomNav(page) {
    return '<nav class="site-bottom-nav" aria-label="Navegación móvil"><div class="site-bottom-nav__shell">' +
      BOTTOM.map(function (b) {
        var tag = b.search ? "button" : "a";
        var attr = b.search ? 'type="button" data-search-open' : 'href="' + b.href + '"';
        return '<' + tag + ' class="site-bottom-tab' + (b.id === page ? " site-bottom-tab--active" : "") + '" ' + attr + '>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + b.d + '"/></svg>' +
          b.label +
        '</' + tag + '>';
      }).join("") +
    '</div></nav>';
  }

  function buildSearch() {
    return '<div class="site-search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Buscar">' +
      '<div class="site-search-scrim" data-search-close></div>' +
      '<div class="site-search-panel">' +
        '<input class="site-search-input" id="searchInput" type="search" placeholder="Buscar anime, género, estudio…" autocomplete="off">' +
        '<div class="site-search-results" id="searchResults"></div>' +
        '<div class="site-search-hint"><span>Enter para abrir · ↑↓ para navegar</span><span><kbd>Esc</kbd> para cerrar</span></div>' +
      '</div>' +
    '</div>';
  }

  /* ── arranque ─────────────────────────────────────────────────────────── */
  function boot() {
    var page = document.body.dataset.page || "";
    var shell = qs(".site-page") || document.body;

    shell.insertAdjacentHTML("afterbegin", buildHeader(page));
    if (!document.body.hasAttribute("data-no-footer")) {
      var main = qs("main");
      (main || shell).insertAdjacentHTML("afterend", buildFooter());
    }
    shell.insertAdjacentHTML("beforeend", buildBottomNav(page) + buildSearch() +
      '<button class="site-scroll-top" id="scrollTop" type="button" aria-label="Volver arriba">' + ico.up + '</button>');

    /* estado de scroll */
    var pill = qs("#topPill"), toTop = qs("#scrollTop");
    function onScroll() {
      if (window.scrollY > 24) pill.setAttribute("data-scrolled", ""); else pill.removeAttribute("data-scrolled");
      if (window.scrollY > 600) toTop.setAttribute("data-visible", ""); else toTop.removeAttribute("data-visible");
    }
    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll();
    toTop.addEventListener("click", function () { window.scrollTo({top: 0, behavior: "smooth"}); });

    /* acento configurable */
    var saved = null;
    try { saved = localStorage.getItem("kagura-accent"); } catch (e) {}
    /* Los acentos de la etapa anterior no pertenecen a la nueva paleta. */
    if (saved && qsa(".accent-dot").some(function (d) { return d.dataset.accent === saved; })) {
      document.documentElement.style.setProperty("--home-accent", saved);
      qsa(".accent-dot").forEach(function (d) { d.setAttribute("aria-pressed", String(d.dataset.accent === saved)); });
    }
    qsa(".accent-dot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        document.documentElement.style.setProperty("--home-accent", dot.dataset.accent);
        qsa(".accent-dot").forEach(function (d) { d.setAttribute("aria-pressed", String(d === dot)); });
        try { localStorage.setItem("kagura-accent", dot.dataset.accent); } catch (e) {}
      });
    });

    /* overlay de búsqueda */
    var overlay = qs("#searchOverlay"), input = qs("#searchInput"), results = qs("#searchResults");
    function renderResults(q) {
      var list = (q ? KEYS.filter(function (k) {
        var a = A[k];
        return (a.t + " " + a.g.join(" ") + " " + a.studio).toLowerCase().indexOf(q.toLowerCase()) > -1;
      }) : KEYS).slice(0, 7);
      results.innerHTML = list.length
        ? list.map(function (k) {
            var a = A[k];
            return '<a class="site-search-row" href="' + href(k) + '">' +
              '<img src="' + IMG + a.p + '" alt="" loading="lazy">' +
              '<span><b>' + a.t + '</b><span>' + a.f + ' · ' + a.y + (a.s ? ' · ' + a.s + '%' : '') + '</span></span></a>';
          }).join("")
        : '<p class="site-search-empty">Sin resultados para “' + q + '”.</p>';
    }
    function openSearch() {
      overlay.setAttribute("data-open", "");
      document.body.setAttribute("data-search-open", "");
      renderResults("");
      requestAnimationFrame(function () { input.focus(); });
    }
    function closeSearch() {
      overlay.removeAttribute("data-open");
      document.body.removeAttribute("data-search-open");
      input.value = "";
    }
    qsa("[data-search-open]").forEach(function (b) { b.addEventListener("click", openSearch); });
    qsa("[data-search-close]").forEach(function (b) { b.addEventListener("click", closeSearch); });
    input.addEventListener("input", function (e) { renderResults(e.target.value.trim()); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.hasAttribute("data-open")) closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.hasAttribute("data-open") ? closeSearch() : openSearch();
      }
    });

    /* filas declaradas con data-row='{"title":…,"items":[…]}' */
    qsa("[data-row]").forEach(function (host) {
      mountRow(host, JSON.parse(host.dataset.row));
    });

    if (typeof window.pageInit === "function") window.pageInit();
  }

  /* API pública para las páginas */
  window.K = {
    ico: ico, card: card, gridCard: gridCard, mountRow: mountRow,
    genreArt: genreArt, genreCard: genreCard,
    el: el, qs: qs, qsa: qsa, href: href, watchHref: watchHref, param: param, img: function (f) { return IMG + f; }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
