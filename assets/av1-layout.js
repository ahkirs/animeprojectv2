(function () {
  "use strict";
  var page = location.pathname.split("/").pop() || "index.html";
  var params = new URLSearchParams(location.search);
  var favoritesKey = "kagura-av1-favorites";
  var $ = function (selector) { return document.querySelector(selector); };
  var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
  var escape = function (value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); };
  var https = function (value) { try { var u = new URL(value); return u.protocol === "https:" ? u.href : ""; } catch (_) { return ""; } };
  var mediaUrl = function (value) { var u = https(value); return u && /^(www\.)?animeav1\.com$/.test(new URL(u).hostname) ? u : ""; };
  var infoHref = function (url) { return "anime.html?url=" + encodeURIComponent(url); };
  var watchHref = function (url, ep) { return "watch.html?url=" + encodeURIComponent(url) + "&ep=" + ep; };
  var text = function (selector, value) { var node = $(selector); if (node) node.textContent = value == null ? "" : String(value); };
  var hide = function (selector) { $$(selector).forEach(function (node) { node.hidden = true; }); };
  var visible = function (selector) { $$(selector).forEach(function (node) { node.hidden = false; }); };
  var map = function (item) { return { _av1:item.url, t:escape(item.title), p:https(item.image), b:https(item.backdrop), f:escape(item.type || "Anime"), y:escape(item.year || ""), s:Number(item.score) || 0, g:(item.genres || []).map(escape), eps:item.episodeCount || 0, d:escape(item.description || "") }; };
  var valid = function (items) { return (items || []).filter(function (item) { return mediaUrl(item.url) && Number(item.episodeCount) > 0; }); };
  var safeCards = function (items, rank) { return valid(items).map(function (item, i) { return K.gridCard(map(item), rank ? i + 1 : null); }).join(""); };
  var favoriteUrls = function () { try { return JSON.parse(localStorage.getItem(favoritesKey) || "[]").filter(mediaUrl); } catch (_) { return []; } };
  function loading() { text("#resCount", "Cargando…"); }
  function error(message) {
    var main = $(".site-page main");
    if (main) main.innerHTML = '<div class="wrap" style="padding:8rem 0"><div class="empty-state"><b>No se pudo cargar el catálogo</b><p>' + escape(message || "Vuelve a intentarlo en unos minutos.") + '</p><a class="site-chip" href="index.html">Volver a inicio</a></div></div>';
  }
  function bindTabs() {
    $$("[data-tab]").forEach(function (tab) { tab.addEventListener("click", function () {
      $$("[data-tab]").forEach(function (other) { other.setAttribute("aria-selected", String(other === tab)); });
      $$("[data-panel]").forEach(function (panel) { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
    }); });
  }
  function updateHeaderStats(items) {
    var stats = $$(".page-head__stat");
    if (stats[0]) { stats[0].querySelector("b").textContent = items.length; stats[0].querySelector("span").textContent = "En esta página"; }
    if (stats[1]) { stats[1].querySelector("b").textContent = items.reduce(function (sum, a) { return sum + (a.episodeCount || 0); }, 0); stats[1].querySelector("span").textContent = "Episodios"; }
    stats.slice(2).forEach(function (node) { node.hidden = true; });
  }
  function genreGroups(items) {
    var groups = {};
    items.forEach(function (item) { (item.genres || []).forEach(function (genre) { if (!groups[genre]) groups[genre] = []; groups[genre].push(item); }); });
    return groups;
  }
  function makeGenreCard(genre, items, i) {
    var image = https(items[0] && (items[0].backdrop || items[0].image));
    return '<a class="genre-card" style="--genre-index:' + i + '" href="generos.html?g=' + encodeURIComponent(genre) + '">' +
      (image ? '<span class="genre-card__art" style="background-image:url(&quot;' + escape(image) + '&quot;)"></span>' : '') +
      '<span class="genre-card__dot"></span><b>' + escape(genre) + '</b><span>' + items.length + ' títulos</span></a>';
  }
  function bannerList(title, items, accent) {
    return '<div class="home-banner-list ' + accent + '"><div class="home-banner-list__header"><span class="home-banner-list__icon">✦</span><h2>' + escape(title) + '</h2><a class="home-banner-list__all" href="buscar.html">Ver todo</a></div>' +
      items.map(function (item,i) { return '<a class="home-banner-row" href="' + infoHref(item.url) + '" style="--genre-index:' + i + '"><span class="home-banner-row__art" style="background-image:url(&quot;' + escape(https(item.backdrop || item.image)) + '&quot;)"></span><span class="home-banner-row__rank">' + (i+1) + '</span><span class="home-banner-row__poster"><img src="' + escape(https(item.image)) + '" alt="" loading="lazy"></span><span class="home-banner-row__body"><b>' + escape(item.title) + '</b><span>' + item.episodeCount + ' episodios</span></span></a>'; }).join("") +
      '<a class="home-banner-list__more" href="buscar.html">Ver todo</a></div>';
  }
  function renderHero(items) {
    var featured = items.slice(0, 3);
    if (!featured.length) return;
    var index = 0;
    function show(i) {
      index = i;
      var item = featured[i];
      $$(".home-hero-slide").forEach(function (slide, j) {
        slide.toggleAttribute("data-active", i === j);
        var image = slide.querySelector("img"); if (image && featured[j]) { image.src = https(featured[j].backdrop || featured[j].image); image.alt = featured[j].title; }
      });
      $$(".hero-dot").forEach(function (dot, j) { dot.setAttribute("aria-pressed", String(i === j)); dot.hidden = j >= featured.length; });
      text("[data-hero-title]", item.title); text("[data-hero-score]", item.score ? Number(item.score).toFixed(1) : "—");
      text("[data-hero-year]", item.year || ""); text("[data-hero-eps]", item.episodeCount + " episodios");
      text("[data-hero-desc]", item.description || "Elige una serie y descubre sus episodios.");
      $("[data-hero-play]").href = watchHref(item.url, 1);
      $("[data-hero-info]").href = infoHref(item.url);
    }
    $$(".hero-dot").forEach(function (dot, i) { dot.onclick = function () { if (featured[i]) show(i); }; });
    show(index);
  }
  function home(items, hasMore) {
    var signals = [
      ["Nuevos episodios","Explorar","nuevos.html"],["Descubrir anime","Con episodios","tendencias.html"],
      ["Mi lista","Series guardadas","mi-lista.html"],["Buscar","Encuentra tu serie","buscar.html"],
      ["Géneros","Explorar categorías","generos.html"]
    ];
    $("#signalGrid").innerHTML = signals.map(function (s,i) { return '<a class="signal-card" style="--signal-index:' + i + '" href="' + s[2] + '"><span class="signal-card__glyph">✦</span><span><b>' + s[0] + '</b><span>' + s[1] + '</span></span></a>'; }).join("");
    renderHero(items);
    var rows = $$("[data-row]");
    if (rows[0]) K.mountRow(rows[0], { title:"Series disponibles", sub:"Elige tu próxima historia", items:items.slice(0, 12).map(map) });
    if (rows[1]) K.mountRow(rows[1], { title:"Más para descubrir", sub:"Con episodios disponibles", items:items.slice(8, 20).map(map) });
    if (rows[2]) K.mountRow(rows[2], { title:"Sigue explorando", sub:"Más anime para ver", items:items.slice(0, 10).reverse().map(map) });
    if (rows[1]) {
      var nanatsuRow = document.createElement("section"); nanatsuRow.className = "wrap"; rows[1].after(nanatsuRow);
      AV1.search("Nanatsu no Taizai").then(function (data) {
        var list = valid(data.results).filter(function (item) { return /^Nanatsu no Taizai(?:\b|:)/i.test(item.title); });
        list.sort(function (a,b) { return Number(b.title === "Nanatsu no Taizai") - Number(a.title === "Nanatsu no Taizai"); });
        if (list.length) K.mountRow(nanatsuRow, { title:"Nanatsu no Taizai", sub:"Temporadas y películas con episodios disponibles", items:list.map(map) });
        else nanatsuRow.remove();
      }).catch(function () { nanatsuRow.remove(); });
    }
    $("#posterGrid").innerHTML = safeCards(items, true);
    var catalogLink = $("#posterGrid").closest("section").querySelector(".section-head a");
    if (catalogLink) { catalogLink.href = "buscar.html"; catalogLink.textContent = "Ver catálogo"; }
    var more = document.createElement("button"); more.className = "site-chip"; more.textContent = "Cargar más animes"; more.hidden = !hasMore;
    $("#posterGrid").after(more);
    var pageNumber = 1;
    more.onclick = function () {
      more.disabled = true; more.textContent = "Cargando…";
      AV1.catalog(pageNumber + 1).then(function (data) {
        pageNumber++;
        $("#posterGrid").insertAdjacentHTML("beforeend",safeCards(data.results));
        more.hidden = !data.hasMore;
        more.textContent = "Cargar más animes";
      }).catch(function () { more.textContent = "Reintentar"; }).finally(function () { more.disabled = false; });
    };
    var groups = genreGroups(items);
    var names = Object.keys(groups).sort(function (a,b) { return groups[b].length - groups[a].length; });
    $("#genreGrid").innerHTML = names.slice(0, 6).map(function (g,i) { return makeGenreCard(g,groups[g],i); }).join("");
    $("#genrePills").innerHTML = names.slice(0, 12).map(function (g) { return '<a class="site-chip" href="generos.html?g=' + encodeURIComponent(g) + '">' + escape(g) + '</a>'; }).join("");
    $("#bannerLists").innerHTML = bannerList("Para empezar",items.slice(0,5),"accent-lime") + bannerList("Sigue explorando",items.slice(5,10),"accent-cyan");
    $$(".home-hero .hero-meta__tag").forEach(function (tag) { tag.hidden = true; });
  }
  function episodeCard(item) {
    var num = item.episodeCount || 1;
    var image = https(item.backdrop || item.image);
    return '<a class="ep-card" href="' + watchHref(item.url,num) + '"><span class="ep-card__art"><img src="' + escape(image) + '" alt="" loading="lazy"><span class="ep-card__num">EP ' + num + '</span></span>' +
      '<span class="ep-card__body"><b>' + escape(item.title) + '</b><span>' + num + ' episodios disponibles</span></span></a>';
  }
  function news(items) {
    text(".page-head__lead", "Descubre series y episodios disponibles para ver.");
    text("#epSub", items.length + " series con episodios");
    $("#epGrid").innerHTML = items.slice(0, 12).map(episodeCard).join("");
    $$("[data-lang]").forEach(function (tab) { tab.hidden = true; });
    var av1Link = $('a[href="animeav1.html"]'); if (av1Link) av1Link.closest("p").remove();
    K.mountRow($("#estrenosRow"), { title:"Más series para ver", sub:"Episodios disponibles", items:items.slice(8, 20).map(map) });
    $("#soonGrid").innerHTML = safeCards(items.slice(0, 7));
    $("#addedList").innerHTML = items.slice(0, 8).map(function (item,i) { return '<a class="genre-result" style="--genre-index:' + i + '" href="' + infoHref(item.url) + '"><span class="genre-result__mark"></span><span class="genre-result__body"><b>' + escape(item.title) + '</b><span>' + item.episodeCount + ' episodios</span></span></a>'; }).join("");
    $$(".section-head p").forEach(function (p) { if (/Próximamente|Series completas/.test(p.textContent)) p.textContent = "Disponibles ahora"; });
  }
  function trends(items) {
    text(".page-head__lead", "Descubre series con episodios disponibles."); updateHeaderStats(items);
    $$("[data-range]").forEach(function (tab) { tab.hidden = true; });
    text("#rankSub", items.length + " series disponibles");
    var podium = items.slice(0, 3).map(function (item,i) { return '<a class="podium-card" href="' + infoHref(item.url) + '"><span class="podium-card__art" style="background-image:url(&quot;' + escape(https(item.backdrop || item.image)) + '&quot;)"></span><span class="podium-card__rank">' + (i+1) + '</span><span class="podium-card__poster"><img src="' + escape(https(item.image)) + '" alt="" loading="lazy"></span><span class="podium-card__body"><b>' + escape(item.title) + '</b><span>' + item.episodeCount + ' episodios</span></span></a>'; }).join("");
    $("#podium").innerHTML = podium;
    $("#rankTable").innerHTML = items.map(function (item,i) { return '<a class="rank-row" href="' + infoHref(item.url) + '"><span class="rank-row__n">' + (i+1) + '</span><span class="rank-row__poster"><img src="' + escape(https(item.image)) + '" alt="" loading="lazy"></span><span class="rank-row__body"><b>' + escape(item.title) + '</b><span>' + escape(item.type || "Anime") + ' · ' + item.episodeCount + ' episodios</span></span></a>'; }).join("");
    $("#bannerLists").innerHTML = bannerList("Series destacadas",items.slice(0,5),"accent-lime") + bannerList("Más para ver",items.slice(5,10),"accent-violet");
    var last = $('[data-row]'); if (last) K.mountRow(last, { title:"Sigue explorando", sub:"Más series disponibles", items:items.slice(0, 12).reverse().map(map) });
    $$(".section-head h2").forEach(function (h) { if (/Podio del día/.test(h.textContent)) h.lastChild.textContent = "Destacados"; });
  }
  function genres(items, hasMore, pageNumber) {
    text(".page-head__lead", "Explora series con episodios disponibles por género."); updateHeaderStats(items);
    var groups = genreGroups(items);
    var names = Object.keys(groups).sort(function (a,b) { return groups[b].length - groups[a].length; });
    var active = params.get("g") || names[0];
    $("#genreGrid").innerHTML = names.map(function (g,i) { return makeGenreCard(g,groups[g],i); }).join("");
    var chosen = groups[active] || [];
    text("#resTitle", active || "Resultados"); text("#resSub", chosen.length + " títulos en esta página");
    $("#resGrid").innerHTML = safeCards(chosen);
    $("#resEmpty").hidden = chosen.length > 0;
    $$("[data-sort]").forEach(function (tab) { tab.hidden = true; });
    $("#spotlight").innerHTML = chosen[0] ? '<a class="genre-result" href="' + infoHref(chosen[0].url) + '"><span class="genre-result__body"><b>' + escape(chosen[0].title) + '</b><span>' + chosen[0].episodeCount + ' episodios</span></span></a>' : "";
    $("#markList").closest("section").hidden = true;
    var pager = $("#av1GenreMore");
    if (!pager) { pager = document.createElement("button"); pager.id = "av1GenreMore"; pager.className = "site-chip"; $("#resGrid").after(pager); }
    pager.textContent = "Cargar más series"; pager.hidden = !hasMore;
    pager.onclick = function () {
      pager.disabled = true; pager.textContent = "Cargando…";
      AV1.catalog(pageNumber + 1).then(function (data) {
        var seen = new Set(items.map(function (item) { return item.url; }));
        var combined = items.concat(valid(data.results).filter(function (item) { return !seen.has(item.url); }));
        genres(combined, data.hasMore, pageNumber + 1);
      }).catch(function () { pager.textContent = "Reintentar"; }).finally(function () { pager.disabled = false; });
    };
  }
  function search(items, hasMoreInitial) {
    var input = $("#q"), grid = $("#grid"), current = items, pageNumber = 1, hasMore = !!hasMoreInitial;
    $("#formatPills").parentElement.hidden = true;
    $("#statusPills").parentElement.hidden = true;
    $("#genrePills").hidden = true;
    var row = $('[data-row]'); if (row) row.hidden = true;
    var pager = document.createElement("button"); pager.className = "site-chip"; pager.textContent = "Cargar más series"; grid.after(pager);
    function render() {
      var list = current.slice();
      var selected = $$('[data-sort][aria-selected="true"]')[0];
      if (selected && selected.dataset.sort === "az") list.sort(function (a,b) { return a.title.localeCompare(b.title); });
      if (selected && selected.dataset.sort === "year") list.sort(function (a,b) { return (Number(b.year)||0) - (Number(a.year)||0); });
      grid.innerHTML = safeCards(list);
      text("#resCount", list.length + " resultados"); text("#resSub", "Solo series con episodios disponibles");
      $("#empty").hidden = list.length > 0;
      pager.hidden = !hasMore || !!input.value.trim();
    }
    function query(value) {
      if (!value) { current = items; pageNumber = 1; hasMore = !!hasMoreInitial; render(); return; }
      text("#resCount", "Buscando…");
      AV1.search(value).then(function (data) { current = valid(data.results); render(); }).catch(function (err) { error(err.message); });
    }
    var timer; input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { query(input.value.trim()); }, 300); });
    pager.onclick = function () {
      pager.disabled = true; pager.textContent = "Cargando…";
      AV1.catalog(pageNumber + 1).then(function (data) {
        pageNumber++;
        hasMore = !!data.hasMore;
        var seen = new Set(current.map(function (item) { return item.url; }));
        current = current.concat(valid(data.results).filter(function (item) { return !seen.has(item.url); }));
        render();
      }).catch(function () { pager.textContent = "Reintentar"; }).finally(function () { pager.disabled = false; if (pager.textContent !== "Reintentar") pager.textContent = "Cargar más series"; });
    };
    $$("[data-sort]").forEach(function (tab) { tab.onclick = function () { $$("[data-sort]").forEach(function (t) { t.setAttribute("aria-selected", String(t === tab)); }); render(); }; });
    if (params.get("q")) { input.value = params.get("q"); query(input.value); } else render();
  }
  function calendar(items) {
    text(".page-head h1", "Episodios disponibles"); text(".page-head__lead", "Explora los episodios que puedes ver ahora.");
    hide(".page-head .filter-bar"); hide("#calGrid"); hide("#calGrid + *");
    var first = $("#calGrid").closest("section"); if (first) first.hidden = true;
    text("#todaySub", items.length + " series con episodios");
    $("#todayGrid").innerHTML = items.slice(0, 12).map(episodeCard).join("");
    var row = $('[data-row]'); if (row) K.mountRow(row, { title:"Más series", sub:"Con episodios disponibles", items:items.slice(8,20).map(map) });
  }
  function myList() {
    var urls = favoriteUrls();
    hide(".page-head__stats"); hide("#continueGrid"); hide("#historyList");
    [$("#continueGrid"),$("#historyList")].forEach(function (node) { if (node) node.closest("section").hidden = true; });
    $$("[data-list]").forEach(function (tab) { tab.hidden = tab.dataset.list !== "favoritos"; });
    text("#listTitle", "Guardados");
    return Promise.all(urls.map(function (url) { return AV1.info(url).then(function (item) { return { url:url,title:item.title,image:item.image,type:item.type,episodeCount:(item.episodes||[]).filter(function (ep) { return mediaUrl(ep.url); }).length }; }).catch(function () { return null; }); })).then(function (items) {
      var list = valid(items.filter(Boolean)); $("#listGrid").innerHTML = safeCards(list); $("#listEmpty").hidden = list.length > 0;
      text("#listSub", list.length + " series guardadas"); text(".page-head__lead", "Las series que guardaste para ver después.");
    });
  }
  function detail() {
    var url = mediaUrl(params.get("url"));
    if (!url) return legacy();
    return AV1.info(url).then(function (a) {
      var episodes = (a.episodes || []).filter(function (ep) { return mediaUrl(ep.url); });
      if (!episodes.length) { error("Este anime no tiene episodios disponibles."); return; }
      document.title = a.title + " — Kagura";
      $("#backdrop").src = https(a.backdrop || a.image); $("#poster").src = https(a.image);
      text("#title", a.title); text("#status", a.status || "Disponible"); text("#studio", [a.type,a.year].filter(Boolean).join(" · "));
      text("#desc", a.description || "Descubre los episodios disponibles de esta serie."); text("#descLong", a.description || "");
      text("#scoreBig", a.score ? Number(a.score).toFixed(1) : "—"); if (!a.score) hide("#scoreBig");
      $("#playBtn").href = watchHref(url,1); $("#playBtn").lastChild.textContent = " Ver ahora";
      $("#facts").innerHTML = '<span>' + escape(a.type || "Anime") + '</span><span>' + episodes.length + ' episodios</span>';
      var genres = (a.genres || []).map(function (g) { return typeof g === "string" ? g : g && g.name; }).filter(Boolean);
      var facts = [["Formato",a.type],["Estado",a.status],["Estreno",a.year],["Episodios",episodes.length],["Géneros",genres.join(", ")]];
      $("#factList").innerHTML = facts.map(function (entry) { return '<div class="fact-row"><dt>' + escape(entry[0]) + '</dt><dd>' + escape(entry[1] || "—") + '</dd></div>'; }).join("");
      $("#tagPills").innerHTML = genres.map(function (g) { return '<a class="site-chip" href="generos.html?g=' + encodeURIComponent(g) + '">' + escape(g) + '</a>'; }).join("");
      $("#epList").innerHTML = episodes.map(function (ep,i) { return '<a class="ep-row" href="' + watchHref(url,i+1) + '"><span class="ep-row__n">' + String(ep.number || i+1).padStart(2,"0") + '</span><span class="ep-row__body"><b>' + escape(ep.title || "Episodio " + (i+1)) + '</b></span></a>'; }).join("");
      var filter = $("[data-panel=eps] .filter-bar"); if (filter) filter.hidden = true;
      hide("#scoreBars"); hide("#sourceRow");
      $$(".anime-aside__panel").forEach(function (panel) { if (/Puntuación|Dónde verlo/.test(panel.querySelector("h3")?.textContent || "")) panel.hidden = true; });
      var fav = $("#listBtn"); function favLabel() { fav.textContent = favoriteUrls().includes(url) ? "✓ En mi lista" : "+ Añadir a mi lista"; } favLabel();
      fav.onclick = function () { var all = favoriteUrls(); localStorage.setItem(favoritesKey, JSON.stringify(all.includes(url) ? all.filter(function (x) { return x !== url; }) : all.concat(url))); favLabel(); };
      bindTabs();
      AV1.catalog(1).then(function (data) { var list = valid(data.results).filter(function (item) { return item.url !== url; }); $("#relGrid").innerHTML = safeCards(list.slice(0,7)); var row = $('[data-row]'); if (row) K.mountRow(row,{title:"Te puede gustar",sub:"Más series para ver",items:list.slice(0,10).map(map)}); });
    }).catch(function (err) { error(err.message); });
  }
  function watch() {
    var url = mediaUrl(params.get("url")); if (!url) return legacy();
    return AV1.info(url).then(function (a) {
      var episodes = (a.episodes || []).filter(function (ep) { return mediaUrl(ep.url); });
      if (!episodes.length) { error("Este anime no tiene episodios disponibles."); return; }
      var index = Math.min(Math.max(Number(params.get("ep")) || 1,1),episodes.length) - 1;
      var ep = episodes[index], player = $(".watch-player");
      document.title = a.title + " · Episodio " + (index+1) + " — Kagura";
      $("#stage").src = https(a.backdrop || a.image); text("#title",a.title); text("#subtitle", ep.title || "Episodio " + (index+1));
      text("#epCount", (index+1) + " / " + episodes.length); text("#epDesc", a.description || "");
      $("#nextBtn").href = watchHref(url, Math.min(index+2,episodes.length)); $("#nextBtn").hidden = index === episodes.length - 1;
      $("#prevBtn").disabled = index === 0; $("#prevBtn").onclick = function () { if (index) location.href = watchHref(url,index); };
      $("#epStrip").innerHTML = episodes.map(function (item,i) { return '<a class="ep-btn" href="' + watchHref(url,i+1) + '"' + (i===index?' aria-current="page"':'') + '>' + String(item.number || i+1).padStart(2,"0") + '</a>'; }).join("");
      $("#playlist").innerHTML = episodes.map(function (item,i) { return '<a class="ep-row" href="' + watchHref(url,i+1) + '"' + (i===index?' aria-current="page"':'') + '><span class="ep-row__n">' + String(item.number || i+1).padStart(2,"0") + '</span><span class="ep-row__thumb"><img src="' + escape(https(a.image)) + '" alt="" loading="lazy"></span><span class="ep-row__body"><b>' + escape(item.title || "Episodio " + (i+1)) + '</b></span></a>'; }).join("");
      $("#factList").innerHTML = '<div class="fact-row"><dt>Episodios</dt><dd>' + episodes.length + '</dd></div>';
      hide(".range-row"); hide(".watch-panel.comments"); hide("#nextEp"); hide(".watch-quick-nav__tabs [data-tab=rel]");
      $("#relGrid").replaceChildren(); bindTabs();
      AV1.episode(ep.url).then(function (data) {
        var sources = []; ["SUB","DUB"].forEach(function (lang) { (data.streamLinks && data.streamLinks[lang] || []).forEach(function (source) { var link = https(source.url); if (link) sources.push({url:link,name:source.server || "Servidor",lang:lang}); }); });
        var bar = $(".server-bar"), current = $("#serverCurrent"), swap = $("#serverSwap");
        hide("#serverPing");
        if (!sources.length) { current.textContent = "Sin fuentes disponibles"; swap.hidden = true; return; }
        var selected = 0;
        var nextHref = index < episodes.length - 1 ? watchHref(url, index+2) : "";
        var customPlayer = KaguraPlayer.mount(player, nextHref);
        function select(i) {
          selected = i; current.textContent = sources[i].name + " · " + sources[i].lang;
          var external = bar.querySelector("[data-open-server]");
          if (!external) { external = document.createElement("a"); external.className = "site-chip"; external.textContent = "Abrir servidor"; external.target = "_blank"; external.rel = "noopener noreferrer"; external.setAttribute("data-open-server", ""); bar.append(external); }
          external.href = sources[i].url;
          customPlayer.select(sources[i].url);
        }
        swap.onclick = function () { select((selected+1) % sources.length); }; swap.hidden = sources.length < 2;
        select(0);
      }).catch(function () { text("#serverCurrent","No se pudo cargar el servidor"); });
    }).catch(function (err) { error(err.message); });
  }
  function legacy() {
    var id = params.get("id"); if (!id) { location.replace("buscar.html"); return; }
    var local = window.A && A[id];
    if (local) { location.replace("buscar.html?q=" + encodeURIComponent(local.t)); return; }
    if (/^\d+$/.test(id) && window.API) API.details(Number(id)).then(function (item) { location.replace("buscar.html?q=" + encodeURIComponent(item.t)); }).catch(function () { location.replace("buscar.html"); });
    else location.replace("buscar.html");
  }
  window.AV1PageInit = function () {
    var operation;
    if (page === "anime.html") operation = detail();
    else if (page === "watch.html") operation = watch();
    else if (page === "mi-lista.html") operation = myList();
    else if (page === "buscar.html") operation = AV1.catalog(1).then(function (data) { search(valid(data.results), data.hasMore); }).catch(function (err) { error(err.message); });
    else operation = AV1.catalog(1).then(function (data) {
      var items = valid(data.results);
      if (page === "index.html") home(items, data.hasMore);
      else if (page === "nuevos.html") news(items);
      else if (page === "tendencias.html") trends(items);
      else if (page === "generos.html") genres(items, data.hasMore, 1);
      else if (page === "calendario.html") calendar(items);
    }).catch(function (err) { error(err.message); });
    Promise.resolve(operation).finally(function () { document.body.setAttribute("data-av1-ready", ""); });
  };
})();
