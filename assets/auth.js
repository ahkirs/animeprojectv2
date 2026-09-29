(function () {
  "use strict";

  var config = window.KAGURA_SUPABASE || {};
  var clientPromise;
  var sdkUrl = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";

  function configured() {
    return /^https:\/\/[^\s/]+\/?$/i.test(config.url || "") &&
      typeof config.publishableKey === "string" && config.publishableKey.length > 20;
  }

  function client() {
    if (!configured()) return Promise.resolve(null);
    if (!clientPromise) {
      clientPromise = new Promise(function (resolve, reject) {
        if (window.supabase) return resolve(window.supabase.createClient(config.url, config.publishableKey));
        var script = document.createElement("script");
        script.src = sdkUrl;
        script.onload = function () { resolve(window.supabase.createClient(config.url, config.publishableKey)); };
        script.onerror = function () { clientPromise = null; reject(new Error("No se pudo cargar Supabase. Revisa tu conexión.")); };
        document.head.appendChild(script);
      });
    }
    return clientPromise;
  }

  function user() {
    return client().then(function (db) {
      if (!db) return null;
      return db.auth.getUser().then(function (result) { return result.data.user || null; });
    });
  }

  function publicProfile(db, id) {
    return db.from("profiles")
      .select("id,username,display_name,bio,avatar_color,favorite_genre,created_at")
      .eq("id", id).maybeSingle();
  }

  function initials(name) {
    return (name || "K").trim().split(/\s+/).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  function avatarColor(value) {
    return ["rose", "lilac", "peach", "mint", "sky"].indexOf(value) > -1 ? value : "rose";
  }

  function updateChrome() {
    user().then(function (current) {
      var avatar = document.querySelector(".nav-avatar");
      if (!avatar) return;
      avatar.href = current ? "perfil.html?v=4" : "acceso.html?v=4";
      avatar.setAttribute("aria-label", current ? "Mi perfil" : "Entrar o registrarse");
      if (!current) { avatar.textContent = "♡"; return; }
      client().then(function (db) {
        publicProfile(db, current.id).then(function (result) {
          var profile = result.data;
          avatar.textContent = initials(profile && profile.display_name || current.user_metadata.display_name || current.email);
          avatar.dataset.color = avatarColor(profile && profile.avatar_color);
        });
      });
    }).catch(function () {});
  }

  window.KAuth = {
    configured: configured,
    client: client,
    user: user,
    publicProfile: publicProfile,
    initials: initials,
    avatarColor: avatarColor,
    updateChrome: updateChrome,
    escape: function (value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
        return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];
      });
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", updateChrome);
  else updateChrome();
})();
