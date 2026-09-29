var AV1 = (function () {
  "use strict";

  function baseUrl() {
    return String(window.ANIMEAV1_GATEWAY_URL || "").replace(/\/+$/, "");
  }

  function configured() { return /^https:\/\//i.test(baseUrl()) || /^http:\/\/localhost(?::\d+)?$/i.test(baseUrl()); }

  function request(path, params) {
    if (!configured()) return Promise.reject(new Error("La conexión con el catálogo aún no está configurada."));
    var url = new URL(baseUrl() + "/api/animeav1/" + path);
    Object.keys(params || {}).forEach(function (key) { url.searchParams.set(key, params[key]); });
    return fetch(url.toString()).then(function (response) {
      return response.json().then(function (body) {
        if (!response.ok || !body.success) throw new Error("No se pudo cargar el catálogo. Inténtalo de nuevo.");
        return body.data;
      });
    });
  }

  function catalogBatch(count) {
    return request("catalog", { page: 1 }).then(function (first) {
      if (!first.hasMore || count <= 1) return Object.assign({}, first, { page: 1 });
      var pages = [];
      for (var page = 2; page <= count; page++) pages.push(page);
      return Promise.allSettled(pages.map(function (page) { return request("catalog", { page: page }); })).then(function (settled) {
        var results = (first.results || []).slice();
        var lastPage = 1;
        var hasMore = first.hasMore;
        for (var i = 0; i < settled.length && hasMore; i++) {
          if (settled[i].status !== "fulfilled") break;
          var data = settled[i].value;
          results.push.apply(results, data.results || []);
          lastPage = pages[i];
          hasMore = !!data.hasMore;
        }
        return { results: results, hasMore: hasMore, page: lastPage };
      });
    });
  }

  return {
    configured: configured,
    catalog: function (page) { return request("catalog", { page: page || 1 }); },
    catalogBatch: catalogBatch,
    search: function (q) { return request("search", { q: q }); },
    info: function (url) { return request("info", { url: url }); },
    episode: function (url) { return request("episode", { url: url }); },
    resolve: function (url) { return request("resolve", { url: url }).then(function (data) { return { stream: baseUrl() + data.stream, type: data.type }; }); }
  };
})();
