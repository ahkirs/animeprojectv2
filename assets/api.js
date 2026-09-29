/* ==========================================================================
   KAGURA · CLIENTE ANILIST (GraphQL)
   Todas las páginas pueden cargar este archivo para obtener datos reales de
   anime desde la API pública de AniList. Sin API key, sin backend, con CORS.
   El catálogo local de data.js sigue funcionando como fallback.
   ========================================================================== */
var API = (function () {
  "use strict";

  var ENDPOINT = "https://graphql.anilist.co";
  var _cache = {};
  var CACHE_TTL = 5 * 60 * 1000; /* 5 minutos */

  /* ── utilidades ─────────────────────────────────────────────────────── */
  function cacheKey(gql, vars) {
    return gql.replace(/\s+/g, " ").trim() + "|" + JSON.stringify(vars || {});
  }

  function query(gql, variables) {
    var key = cacheKey(gql, variables);
    var cached = _cache[key];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return Promise.resolve(cached.data);
    }
    return fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ query: gql, variables: variables || {} })
    })
    .then(function (r) {
      if (!r.ok) throw new Error("AniList " + r.status);
      return r.json();
    })
    .then(function (json) {
      if (json.errors && json.errors.length) {
        throw new Error("AniList: " + json.errors.map(function (e) { return e.message; }).join("; "));
      }
      if (!json.data) throw new Error("AniList no devolvió datos");
      var data = json.data;
      _cache[key] = { data: data, ts: Date.now() };
      return data;
    });
  }

  /* ── mapear respuesta AniList → formato tarjeta Kagura ─────────────── */
  var STATUS_MAP = {
    "RELEASING": "Emitiendo",
    "FINISHED": "Finalizado",
    "NOT_YET_RELEASED": "Próximamente",
    "CANCELLED": "Cancelado",
    "HIATUS": "En pausa"
  };
  var STATUS2_MAP = {
    "RELEASING": "airing",
    "FINISHED": "finished",
    "NOT_YET_RELEASED": "upcoming",
    "CANCELLED": "cancelled",
    "HIATUS": "hiatus"
  };
  var FORMAT_MAP = {
    "TV": "TV",
    "TV_SHORT": "TV Short",
    "MOVIE": "Movie",
    "SPECIAL": "Special",
    "OVA": "OVA",
    "ONA": "ONA",
    "MUSIC": "Music",
    "MANGA": "Manga",
    "NOVEL": "Novel",
    "ONE_SHOT": "One Shot"
  };

  function toCard(m) {
    if (!m) return null;
    var title = (m.title && (m.title.english || m.title.romaji || m.title.native)) || "Sin título";
    var cover = m.coverImage
      ? (m.coverImage.extraLarge || m.coverImage.large || m.coverImage.medium || "")
      : "";
    var banner = m.bannerImage || "";
    var genres = m.genres || [];
    var studioName = "—";
    if (m.studios && m.studios.nodes && m.studios.nodes.length) {
      studioName = m.studios.nodes[0].name;
    }
    var desc = m.description || "";
    /* limpiar HTML básico de la sinopsis */
    desc = desc.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();

    return {
      _id: m.id,
      t: title,
      p: cover,
      b: banner,
      f: FORMAT_MAP[m.format] || m.format || "TV",
      y: m.seasonYear || (m.startDate && m.startDate.year) || 0,
      s: m.averageScore || 0,
      eps: m.episodes || 0,
      st: STATUS_MAP[m.status] || m.status || "",
      st2: STATUS2_MAP[m.status] || "",
      g: genres,
      studio: studioName,
      live: m.status === "RELEASING",
      d: desc,
      /* extras de AniList */
      popularity: m.popularity || 0,
      trending: m.trending || 0,
      nextEp: m.nextAiringEpisode || null,
      color: (m.coverImage && m.coverImage.color) || null
    };
  }

  /* ── fragmento reutilizable ────────────────────────────────────────── */
  var MEDIA_CARD = [
    "id",
    "title { romaji english native }",
    "coverImage { extraLarge large medium color }",
    "bannerImage",
    "averageScore",
    "episodes",
    "format",
    "status",
    "season",
    "seasonYear",
    "startDate { year }",
    "genres",
    "popularity",
    "trending",
    "studios(isMain:true) { nodes { name } }",
    "nextAiringEpisode { episode timeUntilAiring airingAt }"
  ].join("\n      ");

  /* ── queries públicas ──────────────────────────────────────────────── */

  /** Trending anime */
  function trending(page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var gql = "query($p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(type:ANIME,sort:TRENDING_DESC){" + MEDIA_CARD + "}}}";
    return query(gql, { p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Popular anime */
  function popular(page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var gql = "query($p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(type:ANIME,sort:POPULARITY_DESC){" + MEDIA_CARD + "}}}";
    return query(gql, { p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Top rated anime */
  function topRated(page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var gql = "query($p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(type:ANIME,sort:SCORE_DESC,averageScore_greater:1){" + MEDIA_CARD + "}}}";
    return query(gql, { p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Buscar anime con filtros */
  function search(opts) {
    opts = opts || {};
    var vars = { p: opts.page || 1, pp: opts.perPage || 20 };
    var filters = "type:ANIME";
    var params = "$p:Int,$pp:Int";

    if (opts.search) {
      params += ",$q:String";
      filters += ",search:$q";
      vars.q = opts.search;
    }
    if (opts.genre) {
      params += ",$genre:String";
      filters += ",genre:$genre";
      vars.genre = opts.genre;
    }
    if (opts.format) {
      params += ",$fmt:MediaFormat";
      filters += ",format:$fmt";
      vars.fmt = opts.format;
    }
    if (opts.status) {
      params += ",$st:MediaStatus";
      filters += ",status:$st";
      vars.st = opts.status;
    }
    if (opts.season) {
      params += ",$season:MediaSeason";
      filters += ",season:$season";
      vars.season = opts.season;
    }
    if (opts.seasonYear) {
      params += ",$year:Int";
      filters += ",seasonYear:$year";
      vars.year = opts.seasonYear;
    }

    var sortVal = opts.sort || (opts.search ? "SEARCH_MATCH" : "POPULARITY_DESC");
    filters += ",sort:" + sortVal;

    var gql = "query(" + params + "){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(" + filters + "){" + MEDIA_CARD + "}}}";
    return query(gql, vars).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Detalle completo de un anime por ID */
  function details(id) {
    var gql = 'query($id:Int){Media(id:$id,type:ANIME){' +
      MEDIA_CARD + '\n' +
      'description(asHtml:false)\n' +
      'meanScore favourites duration\n' +
      'endDate{year month day}\n' +
      'tags{name rank isMediaSpoiler}\n' +
      'characters(sort:ROLE,perPage:12){edges{role node{name{full}image{medium}}voiceActors(language:JAPANESE){name{full}image{medium}}}}\n' +
      'staff(sort:RELEVANCE,perPage:10){edges{role node{name{full}image{medium}}}}\n' +
      'relations{edges{relationType node{id title{romaji english}coverImage{large}format type status}}}\n' +
      'recommendations(sort:RATING_DESC,perPage:8){nodes{mediaRecommendation{id title{romaji english}coverImage{large}averageScore format type}}}\n' +
      'trailer{id site thumbnail}\n' +
      'externalLinks{url site icon color}\n' +
      'streamingEpisodes{title thumbnail url site}\n' +
    '}}';
    return query(gql, { id: id }).then(function (d) {
      if (!d.Media) throw new Error("Anime no encontrado en AniList");
      var card = toCard(d.Media);
      /* adjuntar la respuesta cruda para datos extendidos */
      card._raw = d.Media;
      return card;
    });
  }

  /** Anime de temporada actual */
  function seasonal(season, year, page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var gql = "query($s:MediaSeason,$y:Int,$p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(type:ANIME,season:$s,seasonYear:$y,sort:POPULARITY_DESC){" + MEDIA_CARD + "}}}";
    return query(gql, { s: season, y: year, p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Anime en emisión (RELEASING) */
  function airing(page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    var gql = "query($p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}media(type:ANIME,status:RELEASING,sort:TRENDING_DESC){" + MEDIA_CARD + "}}}";
    return query(gql, { p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.media.map(toCard),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Calendario de emisión — próximos episodios */
  function schedule(page, perPage) {
    page = page || 1;
    perPage = perPage || 50;
    var gql = "query($p:Int,$pp:Int){Page(page:$p,perPage:$pp){pageInfo{total currentPage lastPage hasNextPage}airingSchedules(notYetAired:true,sort:TIME){airingAt episode media{" + MEDIA_CARD + "}}}}";
    return query(gql, { p: page, pp: perPage }).then(function (d) {
      return {
        items: d.Page.airingSchedules.map(function (s) {
          var card = toCard(s.media);
          card._airingAt = s.airingAt;
          card._episode = s.episode;
          return card;
        }),
        pageInfo: d.Page.pageInfo
      };
    });
  }

  /** Anime por género */
  function byGenre(genre, page, perPage, sort) {
    return search({
      genre: genre,
      page: page || 1,
      perPage: perPage || 24,
      sort: sort || "SCORE_DESC"
    });
  }

  /* ── helpers de temporada ──────────────────────────────────────────── */
  function currentSeason() {
    var m = new Date().getMonth();
    if (m < 3) return "WINTER";
    if (m < 6) return "SPRING";
    if (m < 9) return "SUMMER";
    return "FALL";
  }
  function currentYear() { return new Date().getFullYear(); }

  var SEASON_NAMES = {
    "WINTER": "Invierno", "SPRING": "Primavera",
    "SUMMER": "Verano",   "FALL": "Otoño"
  };

  /** Home page: trae hero + carruseles en una sola query */
  function homePage() {
    var gql = 'query($s:MediaSeason,$y:Int){' +
      'trending:Page(page:1,perPage:5){media(type:ANIME,sort:TRENDING_DESC){' + MEDIA_CARD + ' description(asHtml:false)}}' +
      'popular:Page(page:1,perPage:20){media(type:ANIME,sort:POPULARITY_DESC){' + MEDIA_CARD + '}}' +
      'topRated:Page(page:1,perPage:20){media(type:ANIME,sort:SCORE_DESC,averageScore_greater:1){' + MEDIA_CARD + '}}' +
      'seasonal:Page(page:1,perPage:20){media(type:ANIME,season:$s,seasonYear:$y,sort:POPULARITY_DESC){' + MEDIA_CARD + '}}' +
      'airingNow:Page(page:1,perPage:20){media(type:ANIME,status:RELEASING,sort:TRENDING_DESC){' + MEDIA_CARD + '}}' +
      'recentlyFinished:Page(page:1,perPage:20){media(type:ANIME,status:FINISHED,sort:END_DATE_DESC){' + MEDIA_CARD + '}}' +
    '}';
    return query(gql, { s: currentSeason(), y: currentYear() }).then(function (d) {
      return {
        hero: d.trending.media.map(function (m) {
          var c = toCard(m);
          c.d = (m.description || "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
          return c;
        }),
        popular: d.popular.media.map(toCard),
        topRated: d.topRated.media.map(toCard),
        seasonal: d.seasonal.media.map(toCard),
        airingNow: d.airingNow.media.map(toCard),
        recentlyFinished: d.recentlyFinished.media.map(toCard)
      };
    });
  }

  /* ── API pública ───────────────────────────────────────────────────── */
  return {
    query: query,
    toCard: toCard,
    trending: trending,
    popular: popular,
    topRated: topRated,
    search: search,
    details: details,
    seasonal: seasonal,
    airing: airing,
    schedule: schedule,
    byGenre: byGenre,
    homePage: homePage,
    currentSeason: currentSeason,
    currentYear: currentYear,
    SEASON_NAMES: SEASON_NAMES
  };
})();
