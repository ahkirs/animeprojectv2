/* Controles de Kagura para enlaces de video resueltos por la pasarela. */
window.KaguraPlayer = (function () {
  "use strict";
  function time(value) {
    if (!Number.isFinite(value)) return "0:00";
    return Math.floor(value / 60) + ":" + String(Math.floor(value % 60)).padStart(2, "0");
  }
  function mount(player, nextHref, onFailure) {
    var video = document.createElement("video");
    video.className = "kagura-video";
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", "Episodio de anime");
    player.prepend(video);
    var controls = player.querySelector(".art-kitty-player");
    var progress = controls.querySelector(".art-progress");
    var played = controls.querySelector(".art-progress__played");
    var buffered = controls.querySelector(".art-progress__buffer");
    var knob = controls.querySelector(".art-progress__knob");
    var buttons = controls.querySelectorAll(".art-control");
    var center = player.querySelector(".watch-player__center");
    var timeLabel = controls.querySelector(".art-time");
    var currentRequest = 0;
    var restoreMetadata = null;
    var sourceUrl;
    var speeds = [1, 1.25, 1.5, 2, 0.75];
    player.querySelector(".watch-player__cue").hidden = true;
    progress.setAttribute("role", "slider");
    progress.setAttribute("tabindex", "0");
    progress.setAttribute("aria-label", "Progreso del episodio");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    function update() {
      var fraction = video.duration ? video.currentTime / video.duration : 0;
      var pct = Math.min(100, Math.max(0, fraction * 100));
      played.style.width = knob.style.left = pct + "%";
      if (video.buffered.length && video.duration) buffered.style.width = Math.min(100, video.buffered.end(video.buffered.length - 1) / video.duration * 100) + "%";
      timeLabel.textContent = time(video.currentTime) + " / " + time(video.duration);
      progress.setAttribute("aria-valuenow", String(Math.round(pct)));
      buttons[0].setAttribute("aria-label", video.paused ? "Reproducir" : "Pausar");
      buttons[0].innerHTML = video.paused ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12z"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';
      buttons[2].setAttribute("aria-label", video.muted ? "Activar sonido" : "Silenciar");
      center.hidden = !video.paused || !sourceUrl;
    }
    function toggle() { if (video.paused) video.play().catch(function () {}); else video.pause(); }
    function seek(fraction) { if (Number.isFinite(video.duration)) video.currentTime = Math.min(video.duration, Math.max(0, video.duration * fraction)); }
    progress.addEventListener("click", function (event) { seek((event.clientX - progress.getBoundingClientRect().left) / progress.clientWidth); });
    progress.addEventListener("keydown", function (event) { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); video.currentTime += event.key === "ArrowRight" ? 5 : -5; } });
    buttons[0].onclick = toggle;
    center.querySelector("button").onclick = toggle;
    video.onclick = toggle;
    buttons[1].onclick = function () { if (nextHref) location.href = nextHref; };
    buttons[1].hidden = !nextHref;
    buttons[2].onclick = function () { video.muted = !video.muted; update(); };
    buttons[3].onclick = function () { var i = speeds.indexOf(video.playbackRate); video.playbackRate = speeds[(i + 1) % speeds.length]; buttons[3].title = "Velocidad: " + video.playbackRate + "×"; };
    buttons[3].setAttribute("aria-label", "Cambiar velocidad");
    buttons[3].title = "Velocidad: 1×";
    buttons[4].onclick = function () { if (document.pictureInPictureElement) document.exitPictureInPicture(); else if (video.requestPictureInPicture) video.requestPictureInPicture().catch(function () {}); };
    buttons[4].setAttribute("aria-label", "Imagen en imagen");
    buttons[4].title = "Imagen en imagen";
    buttons[5].onclick = function () { if (document.fullscreenElement) document.exitFullscreen(); else player.requestFullscreen(); };
    ["timeupdate", "durationchange", "progress", "play", "pause", "volumechange", "loadedmetadata"].forEach(function (name) { video.addEventListener(name, update); });
    function unavailable() {
      sourceUrl = "";
      video.removeAttribute("src"); video.load();
      player.dataset.playerMode = "unavailable";
      controls.hidden = center.hidden = true;
    }
    video.addEventListener("error", function () {
      if (!sourceUrl || !video.currentSrc) return;
      unavailable();
      if (onFailure) onFailure();
    });
    return {
      select: function (url) {
        var request = ++currentRequest;
        var resumeAt = Number.isFinite(video.currentTime) ? video.currentTime : 0;
        var resumePlaying = !video.paused;
        if (restoreMetadata) video.removeEventListener("loadedmetadata", restoreMetadata);
        sourceUrl = "";
        video.pause(); video.removeAttribute("src"); video.load();
        player.dataset.playerMode = "loading";
        controls.hidden = center.hidden = true;
        function resolveWithRetry(tries) {
          return AV1.resolve(url).catch(function (err) {
            if (tries > 0 && request === currentRequest) return new Promise(function (done) { setTimeout(done, 500); }).then(function () { return resolveWithRetry(tries - 1); });
            throw err;
          });
        }
        return resolveWithRetry(1).then(function (result) {
          if (request !== currentRequest) return "cancelled";
          sourceUrl = result.stream;
          video.src = sourceUrl;
          player.dataset.playerMode = "video";
          controls.hidden = center.hidden = false;
          restoreMetadata = function () {
            if (request !== currentRequest) return;
            if (resumeAt > 0 && Number.isFinite(video.duration)) video.currentTime = Math.min(resumeAt, Math.max(0, video.duration - 1));
            if (resumePlaying) video.play().catch(function () {});
            restoreMetadata = null;
          };
          video.addEventListener("loadedmetadata", restoreMetadata, { once:true });
          video.load(); update();
          return "video";
        }).catch(function () { if (request === currentRequest) { unavailable(); return "unavailable"; } return "cancelled"; });
      }
    };
  }
  return { mount: mount };
})();
