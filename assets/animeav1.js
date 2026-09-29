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

  return {
    configured: configured,
    catalog: function (page) { return request("catalog", { page: page || 1 }); },
    search: function (q) { return request("search", { q: q }); },
    info: function (url) { return request("info", { url: url }); },
    episode: function (url) { return request("episode", { url: url }); },
    resolve: function (url) { return request("resolve", { url: url }).then(function (data) { return { stream: baseUrl() + data.stream, type: data.type }; }); }
  };
})();
